import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersFactory } from '../../test/factories/users.factory';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    merge: jest
      .fn()
      .mockImplementation((entity, data) => Object.assign(entity, data)),
  };
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = UsersFactory.create();
      const createUserDto = {
        username: user.username,
        email: user.email,
        password: 'StrongPass123!',
      };
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);
      const result = await service.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(user);

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(result.id).toStrictEqual(expect.any(Number));
      expect(result.email).toBe(createUserDto.email);
      expect(result.username).toBe(createUserDto.username);
      expect(result.password_hash).not.toBe(createUserDto.password);
      expect(result.created_at).toBeDefined();
      expect(result.created_at).toStrictEqual(expect.any(Date));
    });

    it('should throw an error if user already exists', async () => {
      const user = UsersFactory.create();
      const createUserDto = {
        username: user.username,
        email: user.email,
        password: 'StrongPass123!',
      };
      mockRepository.findOne.mockResolvedValue(user);
      try {
        await service.create(createUserDto);
      } catch (error) {
        expect(error.message).toBe('User already exists');
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  it('should return all users', async () => {
    const users = UsersFactory.createMany(10);

    userRepository.find = jest.fn().mockResolvedValueOnce(users);
    const result = await service.findAll();
    expect(result).toBe(users);
    expect(result).toHaveLength(10);
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = 1;
      const user = UsersFactory.create({ id });
      userRepository.findOne = jest.fn().mockResolvedValueOnce(user);

      const result = await service.findOne(id);
      expect(result).toBe(user);
      expect(result.id).toBe(id);
    });

    it('should throw an error if user not found', async () => {
      const id = 1;
      userRepository.findOne = jest.fn().mockResolvedValueOnce(undefined);
      try {
        await service.findOne(id);
      } catch (error) {
        expect(error.message).toBe('User not found');
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  it('should update a user by id', async () => {
    const id = 1;
    const updateUserDto = { username: 'JaneDoe' };
    const user = UsersFactory.create({ id });

    userRepository.findOne = jest.fn().mockResolvedValueOnce(user);
    userRepository.save = jest
      .fn()
      .mockResolvedValueOnce({ ...user, ...updateUserDto });

    const result = await service.update(id, updateUserDto);

    expect(result).toBeDefined();
    expect(result.username).toBe(updateUserDto.username);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(userRepository.save).toHaveBeenCalledWith({
      ...user,
      ...updateUserDto,
    });
  });

  it('should remove a user by id', async () => {
    const id = 1;
    userRepository.findOne = jest
      .fn()
      .mockResolvedValueOnce(UsersFactory.create({ id }));
    userRepository.remove = jest.fn().mockResolvedValueOnce({ id });
    const result = await service.remove(id);
    expect(result).toBeDefined();
    expect(result).toStrictEqual({ id });
  });
});
