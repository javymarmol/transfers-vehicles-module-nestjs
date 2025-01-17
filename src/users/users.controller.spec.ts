import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { UsersFactory } from '../../test/factories/users.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectsFactory } from '../../test/factories/projects.factory';
import { CreateUserDto } from './dto/create-user.dto';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === UsersService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = await module.resolve<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    const usersFactory = UsersFactory.createMany(2);
    service.findAll = jest.fn().mockResolvedValue(usersFactory);

    const result = await controller.findAll();

    expect(result).toBe(usersFactory);
    expect(result.length).toBe(2);
    expect(result[0].username).toBe(usersFactory[0].username);
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const user = UsersFactory.create();
      service.findOne = jest.fn().mockResolvedValue(user);

      const result = await controller.findOne(user.id);

      expect(result).toBe(user);
      expect(result.username).toBe(user.username);
    });

    it('should return an user with a project', async () => {
      const project = ProjectsFactory.create();
      const user = UsersFactory.create();
      user.projects = [project];
      service.findOne = jest.fn().mockResolvedValue(user);

      const result = await controller.findOne(user.id);
      expect(result).toBe(user);
      expect(user.projects).toContain(project);
      expect(user.projects.length).toBe(1);
    });

    it('should throw an error if user not found', async () => {
      service.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = UsersFactory.create();
      const createUserDto: CreateUserDto = {
        username: user.username,
        email: user.email,
        password: 'StrongPass123!',
        projectsIds: [],
        organizationalUnitsIds: [],
      };
      service.create = jest.fn().mockResolvedValue(user);

      const result = await controller.create(createUserDto);

      expect(result).toBe(user);
      expect(result.username).toBe(user.username);
      expect(result.email).toBe(user.email);
      expect(result.password_hash).not.toBe(createUserDto.password);
    });

    it('should create a user with 2 projects', async () => {
      const user = UsersFactory.create();
      const projects = ProjectsFactory.createMany(2);
      const createUserDto = {
        username: user.username,
        email: user.email,
        password: 'StrongPass123!',
        projectsIds: projects.map((project) => project.id),
        organizationalUnitsIds: [],
      };
      user.projects = projects;

      service.create = jest.fn().mockResolvedValue(user);

      const result = await controller.create(createUserDto);

      expect(result).toBe(user);
      expect(result.username).toBe(user.username);
      expect(result.email).toBe(user.email);
      expect(result.password_hash).not.toBe(createUserDto.password);
      expect(result.projects).toContain(projects[0]);
      expect(result.projects).toContain(projects[1]);
      expect(result.projects.length).toBe(2);
    });

    it('should throw an error if user already exists', async () => {
      const user = UsersFactory.create();
      const createUserDto = {
        username: user.username,
        email: user.email,
        password: 'StrongPass123!',
        projectsIds: [],
        organizationalUnitsIds: [],
      };
      service.create = jest
        .fn()
        .mockRejectedValue(new BadRequestException('User already exists'));

      await expect(controller.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = UsersFactory.create();
      const updateUserDto = {
        username: 'new-username',
      };
      service.update = jest
        .fn()
        .mockImplementation((id, data) =>
          Promise.resolve(Object.assign(user, data)),
        );

      const result = await controller.update(user.id, updateUserDto);

      expect(result).toBe(user);
      expect(result.username).toBe(updateUserDto.username);
    });

    it('should update project to user', async () => {
      const user = UsersFactory.create();
      const project = ProjectsFactory.create();
      const updateUserDto = {
        projectsIds: [project.id],
      };
      user.projects = [project];
      service.update = jest
        .fn()
        .mockImplementation((id, data) =>
          Promise.resolve(Object.assign(user, data)),
        );

      const result = await controller.update(user.id, updateUserDto);

      expect(result).toBe(user);
      expect(result.projects).toContain(project);
      expect(result.projects.length).toBe(1);
    });

    it('should throw an error if user not found', async () => {
      service.update = jest
        .fn()
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        controller.update(1, { username: 'new-username' }),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(1, {
        username: 'new-username',
      });
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = UsersFactory.create();
      service.remove = jest.fn().mockResolvedValue(user);

      const result = await controller.remove(user.id);

      expect(result).toBe(user);
      expect(result.username).toBe(user.username);
    });

    it('should throw an error if user not found', async () => {
      service.remove = jest
        .fn()
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeProject', () => {
    it('should remove a project from user', async () => {
      const user = UsersFactory.create();
      const project = ProjectsFactory.create();
      service.removeProjectFromUser = jest.fn().mockResolvedValue(user);

      const result = await controller.removeProject(user.id, project.id);

      expect(result).toBe(user);
      expect(result.projects).not.toContain(project);
      expect(result.projects.length).toBe(0);
    });

    it('should throw an error if user not found', async () => {
      service.removeProjectFromUser = jest
        .fn()
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.removeProject(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.removeProjectFromUser).toHaveBeenCalledWith(1, 1);
      expect(service.removeProjectFromUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('addProject', () => {
    it('should add a project to user', async () => {
      const user = UsersFactory.create();
      const project = ProjectsFactory.create();
      user.projects = [project];
      service.addProjectToUser = jest.fn().mockResolvedValue(user);

      const result = await controller.addProject(user.id, project.id);

      expect(result).toBe(user);
      expect(result.projects).toContain(project);
      expect(result.projects.length).toBe(1);
    });

    it('should throw an error if user not found', async () => {
      service.addProjectToUser = jest
        .fn()
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.addProject(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.addProjectToUser).toHaveBeenCalledWith(1, 1);
      expect(service.addProjectToUser).toHaveBeenCalledTimes(1);
    });
  });
});
