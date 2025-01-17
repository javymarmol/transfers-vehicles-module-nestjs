import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { OrganizationalUnit } from '../organizational_units/entities/organizational_unit.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(OrganizationalUnit)
    private readonly organizationalUnitsRepository: Repository<OrganizationalUnit>,
  ) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.validateUserData(data);
    if (!existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = this.usersRepository.create(data);
    if (data.projectsIds) {
      user.projects = await this.projectsRepository.findBy({
        id: In(data.projectsIds),
      });
    }
    if (data.organizationalUnitsIds) {
      user.organizational_units =
        await this.organizationalUnitsRepository.findBy({
          id: In(data.organizationalUnitsIds),
        });
    }

    user.password_hash = await bcrypt.hash(data.password, 10);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({});
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['projects', 'organizational_units'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    if (changes.projectsIds) {
      user.projects = await this.projectsRepository.findBy({
        id: In(changes.projectsIds),
      });
    }

    if (changes.organizationalUnitsIds) {
      user.organizational_units =
        await this.organizationalUnitsRepository.findBy({
          id: In(changes.organizationalUnitsIds),
        });
    }

    this.usersRepository.merge(user, changes);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }

  private async validateUserData(userData: CreateUserDto): Promise<boolean> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: userData.email }, { username: userData.username }],
    });
    return !existingUser;
  }

  async addProjectToUser(userId: number, projectId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['projects'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    user.projects.push(project);
    return this.usersRepository.save(user);
  }

  async removeProjectFromUser(userId: number, projectId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['projects'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.projects = user.projects.filter((project) => project.id !== projectId);
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
