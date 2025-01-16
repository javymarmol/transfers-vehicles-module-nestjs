import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationalUnitDto } from './dto/create-organizational_unit.dto';
import { UpdateOrganizationalUnitDto } from './dto/update-organizational_unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationalUnit } from './entities/organizational_unit.entity';
import { In, Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrganizationalUnitsService {
  constructor(
    @InjectRepository(OrganizationalUnit)
    private readonly unitsRepository: Repository<OrganizationalUnit>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateOrganizationalUnitDto) {
    const existingUnit = await this.unitsRepository.findOne({
      where: { name: data.name, project: { id: data.projectId } },
    });

    if (existingUnit) {
      throw new BadRequestException('Unit already exists');
    }

    const unit = this.unitsRepository.create(data);
    unit.project = await this.projectsRepository.findOne({
      where: { id: data.projectId },
    });

    if (data.usersIds) {
      unit.users = await this.usersRepository.find({
        where: { id: In(data.usersIds) },
      });
    }

    return this.unitsRepository.save(unit);
  }

  findAll() {
    return this.unitsRepository.find({ relations: ['project'] });
  }

  async findOne(id: number) {
    const unit = await this.unitsRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }
    return unit;
  }

  async update(id: number, changes: UpdateOrganizationalUnitDto) {
    const unit = await this.unitsRepository.findOne({ where: { id } });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    this.unitsRepository.merge(unit, changes);

    return this.unitsRepository.save(unit);
  }

  async remove(id: number) {
    const unit = await this.unitsRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return this.unitsRepository.delete(id);
  }

  async findByProjectId(projectId: number) {
    return this.unitsRepository.find({ where: { project: { id: projectId } } });
  }

  findByOneProjectIdAndUnitId(projectId: number, unitId: number) {
    return this.unitsRepository.findOne({
      where: { id: unitId, project: { id: projectId } },
    });
  }

  async removeByProjectId(projectId: number) {
    return this.unitsRepository.delete({ project: { id: projectId } });
  }

  async removeByProjectIdAndUnitId(projectId: number, unitId: number) {
    return this.unitsRepository.delete({
      id: unitId,
      project: { id: projectId },
    });
  }

  async findByUserId(userId: number) {
    return this.unitsRepository.find({ where: { users: { id: userId } } });
  }

  async findOneByUserIdAndUnitId(userId: number, unitId: number) {
    return this.unitsRepository.findOne({
      where: { id: unitId, users: { id: userId } },
    });
  }

  async findByProjectIdAndUserId(projectId: number, userId: number) {
    return this.unitsRepository.find({
      where: { project: { id: projectId }, users: { id: userId } },
    });
  }

  async findOneByProjectIdAndUserIdAndUnitId(
    projectId: number,
    userId: number,
    unitId: number,
  ) {
    return this.unitsRepository.findOne({
      where: { id: unitId, project: { id: projectId }, users: { id: userId } },
    });
  }
}
