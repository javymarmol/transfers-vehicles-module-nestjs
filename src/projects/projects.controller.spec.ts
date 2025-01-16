import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsFactory } from '../../test/factories/projects.factory';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
    })
      .useMocker((token) => {
        if (token === ProjectsService) {
          return { findAll: jest.fn().mockResolvedValue([]) };
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

    controller = module.get<ProjectsController>(ProjectsController);
    service = await module.resolve<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of projects', async () => {
    const projectsFactory = ProjectsFactory.createMany(2);
    service.findAll = jest.fn().mockResolvedValue(projectsFactory);

    const result = await controller.findAll();

    expect(result).toBe(projectsFactory);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe(projectsFactory[0].name);
  });

  describe('findOne', () => {
    it('should return a project', async () => {
      const project = ProjectsFactory.create();
      service.findOne = jest.fn().mockResolvedValue(project);

      const result = await controller.findOne(project.id);

      expect(result).toBe(project);
      expect(result.name).toBe(project.name);
    });

    it('should throw NotFoundException', async () => {
      service.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Project not found'));

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a project', async () => {
      const project = ProjectsFactory.create();
      const createProjectDto = {
        name: project.name,
        description: project.description,
      };
      service.create = jest.fn().mockResolvedValue(project);

      const result = await controller.create(createProjectDto);

      expect(result).toBe(project);
      expect(result.name).toBe(project.name);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const project = ProjectsFactory.create();
      const updateProjectDto = {
        name: project.name,
        description: project.description,
      };
      service.update = jest.fn().mockResolvedValue(project);

      const result = await controller.update(project.id, updateProjectDto);

      expect(result).toBe(project);
      expect(result.name).toBe(project.name);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      const project = ProjectsFactory.create();
      service.remove = jest.fn().mockResolvedValue(project);

      const result = await controller.remove(project.id);

      expect(result).toBe(project);
    });

    it('should throw NotFoundException', async () => {
      service.remove = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Project not found'));

      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
