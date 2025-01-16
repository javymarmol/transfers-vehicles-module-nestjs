import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";

import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { UsersFactory } from "../../test/factories/users.factory";
import { ProjectsFactory } from "../../test/factories/projects.factory";
import { Project } from "../projects/entities/project.entity";

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    merge: jest
      .fn()
      .mockImplementation((entity, data) => Object.assign(entity, data)),
  };
  let userRepository: Repository<User>;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project,
    );
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
        projectsIds: []
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

    it("should create a user with 2 projects", async () => {
      const user = UsersFactory.create();
      const projects = ProjectsFactory.createMany(2);
      const createUserDto = {
        username: user.username,
        email: user.email,
        password: "StrongPass123!",
        projectsIds: projects.map((project) => project.id)
      };
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);
      projectRepository.findBy = jest.fn().mockResolvedValue(projects);

      const result = await service.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username }
        ]
      });

      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(user);
      expect(projectRepository.findBy).toHaveBeenCalledWith({
        id: In(createUserDto.projectsIds)
      });
      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(result.projects.length).toBe(2);
      expect(result.projects).toContain(projects[0]);
      expect(result.projects).toContain(projects[1]);
    });

    it('should throw an error if user already exists', async () => {
      const user = UsersFactory.create();
      const createUserDto = {
        username: user.username,
        email: user.email,
        password: 'StrongPass123!',
        projectsIds: [1, 2]
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

    it("should return an user by id with a project", async () => {
      const project = ProjectsFactory.create();
      const user = UsersFactory.create();
      user.projects = [project];
      userRepository.findOne = jest.fn().mockResolvedValueOnce(user);

      const result = await service.findOne(user.id);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
        relations: ["projects"]
      });
      expect(result).toBe(user);
      expect(result.projects).toContain(project);
      expect(result.projects.length).toBe(1);
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
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ["projects"]
    });
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

  describe("Projects User", () => {
    describe("addProjectToUser", () => {
      it("should add a project to user", async () => {
        const user = UsersFactory.create();
        const project = ProjectsFactory.create();

        jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);
        jest.spyOn(projectRepository, "findOne").mockResolvedValueOnce(project);
        userRepository.save = jest
          .fn()
          .mockResolvedValueOnce({ ...user, projects: [project] });

        const result = await service.addProjectToUser(user.id, project.id);

        expect(result).toBeDefined();
        expect(result.projects).toContain(project);
        expect(result.projects.length).toBe(1);
      });

      it("should should throw an error if user not found ", async () => {
        userRepository.findOne = jest.fn().mockResolvedValueOnce(null);

        try {
          await service.addProjectToUser(1, 1);
        } catch (error) {
          expect(error.message).toBe("User not found");
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it("should should throw an error if project not found ", async () => {
        const user = UsersFactory.create();
        jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);
        jest.spyOn(projectRepository, "findOne").mockResolvedValueOnce(null);

        try {
          await service.addProjectToUser(user.id, 1);
        } catch (error) {
          expect(error.message).toBe("Project not found");
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe("removeProjectFromUser", () => {
      it("should remove a project from user", async () => {
        const user = UsersFactory.create();
        const project = ProjectsFactory.create();
        user.projects = [project];

        userRepository.findOne = jest.fn().mockResolvedValueOnce(user);
        userRepository.save = jest
          .fn()
          .mockResolvedValueOnce({ ...user, projects: [] });

        const result = await service.removeProjectFromUser(user.id, project.id);

        expect(result).toBeDefined();
        expect(result.projects).toEqual([]);
      });

      it("should should throw an error if user not found ", async () => {
        userRepository.findOne = jest.fn().mockResolvedValueOnce(null);

        try {
          await service.removeProjectFromUser(1, 1);
        } catch (error) {
          expect(error.message).toBe("User not found");
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it("should should throw an error if project not found ", async () => {
        const user = UsersFactory.create();
        userRepository.findOne = jest.fn().mockResolvedValueOnce(user);

        try {
          await service.removeProjectFromUser(user.id, 1);
        } catch (error) {
          expect(error.message).toBe("Project not found");
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
