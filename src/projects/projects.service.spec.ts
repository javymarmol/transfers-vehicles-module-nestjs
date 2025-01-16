import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { ProjectsFactory } from '../../test/factories/projects.factory';
import { Project } from './entities/project.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const project = ProjectsFactory.create();
      const createProjectDto = {
        name: project.name,
        description: project.description,
      };
      mockRepository.create.mockReturnValue(project);
      mockRepository.save.mockResolvedValue(project);

      const result = await service.create(createProjectDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createProjectDto);
      expect(mockRepository.save).toHaveBeenCalledWith(project);
      expect(result).toBe(project);
      expect(result.name).toBe(project.name);
      expect(result.description).toBe(project.description);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projectsFactory = ProjectsFactory.createMany(2);
      mockRepository.find.mockResolvedValue(projectsFactory);

      const result = await service.findAll();

      expect(result).toBe(projectsFactory);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe(projectsFactory[0].name);
    });

    it('should return an empty array', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a project', async () => {
      const project = ProjectsFactory.create();
      mockRepository.findOne.mockResolvedValue(project);

      const result = await service.findOne(project.id);

      expect(result).toBe(project);
      expect(result.name).toBe(project.name);
    });

    it('should throw an error if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      try {
        await service.findOne(1);
      } catch (error) {
        expect(error.message).toBe('Project not found');
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.status).toBe(404);
      }
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const project = ProjectsFactory.create();
      const updateProjectDto = {
        description: 'description updated',
      };
      mockRepository.findOne.mockResolvedValue(project);
      mockRepository.save = jest
        .fn()
        .mockResolvedValueOnce({ ...project, ...updateProjectDto });

      const result = await service.update(project.id, updateProjectDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: project.id },
        relations: ['organizational_units'],
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(
        project,
        updateProjectDto,
      );
      expect(result).toEqual(project);
      expect(result.name).toBe(project.name);
    });

    it('should throw an error if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      try {
        await service.update(1, {});
      } catch (error) {
        expect(error.message).toBe('Project not found');
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.status).toBe(404);
      }
    });
  });
});
