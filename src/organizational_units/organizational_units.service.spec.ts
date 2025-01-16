import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitsService } from './organizational_units.service';
import { OrganizationalUnit } from './entities/organizational_unit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

describe('OrganizationalUnitsService', () => {
  let service: OrganizationalUnitsService;

  beforeEach(async () => {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationalUnitsService,
        {
          provide: getRepositoryToken(OrganizationalUnit),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrganizationalUnitsService>(
      OrganizationalUnitsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
