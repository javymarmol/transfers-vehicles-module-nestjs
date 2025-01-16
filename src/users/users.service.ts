import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.validateUserData(data);
    if (!existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = this.usersRepository.create(data);
    user.password_hash = await bcrypt.hash(data.password, 10);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({});
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
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
}
