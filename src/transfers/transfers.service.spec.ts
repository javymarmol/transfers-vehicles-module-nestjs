import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { OrganizationalUnitsService } from '../organizational_units/organizational_units.service';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { ProjectsFactory } from '../../test/factories/projects.factory';
import { OrganizationalUnitsFactory } from '../../test/factories/organizational-units.factory';
import { UsersFactory } from '../../test/factories/users.factory';
import { TransfersFactory } from '../../test/factories/transfers.factory';
import { Repository } from 'typeorm';

describe('TransfersService', () => {
  let transfersService: TransfersService;
  let vehiclesService: VehiclesService;
  let projectsService: ProjectsService;
  let organizationalUnitsService: OrganizationalUnitsService;
  let usersService: UsersService;

  let transferRepository: Repository<Transfer>;

  const mockService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return [
        {
          id: 1,
          projectId: 1,
          organizationalUnitId: 1,
          clientId: 1,
          transmitterId: 1,
          vehicleId: 1,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: ProjectsService,
          useValue: {},
        },
        {
          provide: OrganizationalUnitsService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: VehiclesService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Transfer),
          useValue: {},
        },
      ],
    }).compile();

    transfersService = module.get<TransfersService>(TransfersService);
    projectsService = module.get<ProjectsService>(ProjectsService);
    organizationalUnitsService = module.get<OrganizationalUnitsService>(
      OrganizationalUnitsService,
    );
    usersService = module.get<UsersService>(UsersService);
    vehiclesService = module.get<VehiclesService>(VehiclesService);
    transferRepository = module.get(getRepositoryToken(Transfer));
  });

  it('should be defined', () => {
    expect(transfersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a transfer', async () => {
      const dto: CreateTransferDto = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      transfersService.create = mockService.create;
      expect(await transfersService.create(dto)).toEqual({
        id: 1,
        ...dto,
      });
    });

    it('should throw NotFoundException for Project', async () => {
      const dto: CreateTransferDto = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      projectsService.findOne = jest.fn(() => {
        throw new NotFoundException('Project not found');
      });
      await expect(transfersService.create(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for OrganizationalUnit', async () => {
      const dto: CreateTransferDto = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      const project = ProjectsFactory.create();
      projectsService.findOne = jest.fn().mockResolvedValue(project);
      organizationalUnitsService.findOne = jest.fn(() => {
        throw new NotFoundException('OrganizationalUnit not found');
      });
      await expect(transfersService.create(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for Client', async () => {
      const dto: CreateTransferDto = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      const project = ProjectsFactory.create();
      const orgUnit = OrganizationalUnitsFactory.create();
      projectsService.findOne = jest.fn().mockResolvedValue(project);
      organizationalUnitsService.findOne = jest.fn().mockResolvedValue(orgUnit);
      usersService.findOne = jest.fn(() => {
        throw new NotFoundException('User not found');
      });
      await expect(transfersService.create(dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException for Transmitter', async () => {
      const dto: CreateTransferDto = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      const project = ProjectsFactory.create();
      const orgUnit = OrganizationalUnitsFactory.create();
      const client = UsersFactory.create();
      projectsService.findOne = jest.fn().mockResolvedValue(project);
      organizationalUnitsService.findOne = jest.fn().mockResolvedValue(orgUnit);
      usersService.findOne = jest.fn().mockResolvedValueOnce(client);
      usersService.findOne = jest
        .fn()
        .mockRejectedValueOnce(new NotFoundException('User not found'));
      await expect(transfersService.create(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for Vehicle', async () => {
      const dto: CreateTransferDto = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      const project = ProjectsFactory.create();
      const orgUnit = OrganizationalUnitsFactory.create();
      const client = UsersFactory.create();
      const transmitter = UsersFactory.create();
      projectsService.findOne = jest.fn().mockResolvedValue(project);
      organizationalUnitsService.findOne = jest.fn().mockResolvedValue(orgUnit);
      usersService.findOne = jest.fn().mockResolvedValueOnce(client);
      usersService.findOne = jest.fn().mockResolvedValueOnce(transmitter);
      vehiclesService.findOne = jest.fn(() => {
        throw new NotFoundException('Vehicle not found');
      });
      await expect(transfersService.create(dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(vehiclesService.findOne).toHaveBeenCalled();
      expect(usersService.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAll', () => {
    it('should return all transfers', async () => {
      const transfers = TransfersFactory.createMany(2);
      transferRepository.find = jest.fn().mockResolvedValue(transfers);
      const result = await transfersService.findAll();
      expect(result).toEqual(transfers);
      expect(result.length).toEqual(2);
      expect(transferRepository.find).toHaveBeenCalled();
    });

    it('should return empty array', async () => {
      transferRepository.find = jest.fn().mockResolvedValue([]);
      const result = await transfersService.findAll();
      expect(result).toEqual([]);
      expect(transferRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transfer', async () => {
      const transfer = TransfersFactory.create();
      transferRepository.findOne = jest.fn().mockResolvedValue(transfer);
      const result = await transfersService.findOne(1);
      expect(result).toEqual(transfer);
      expect(transferRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      transferRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(transfersService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(transferRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a transfer', async () => {
      const transfer = TransfersFactory.create();
      const changes = { projectId: 2 };
      const updatedTransfer = { ...transfer, ...changes };
      transferRepository.findOne = jest.fn().mockResolvedValue(transfer);
      transferRepository.merge = jest
        .fn()
        .mockImplementation((entity, data) => Object.assign(entity, data));
      projectsService.findOne = jest
        .fn()
        .mockResolvedValue(ProjectsFactory.create());
      transferRepository.save = jest.fn().mockResolvedValue(updatedTransfer);
      const result = await transfersService.update(1, changes);
      expect(result).toEqual(updatedTransfer);
      expect(transferRepository.findOne).toHaveBeenCalled();
      expect(projectsService.findOne).toHaveBeenCalled();
      expect(transferRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      transferRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(transfersService.update(1, {})).rejects.toThrow(
        NotFoundException,
      );
      expect(transferRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a transfer', async () => {
      const id = 1;
      const transfer = TransfersFactory.create({ id });
      transferRepository.findOne = jest.fn().mockResolvedValueOnce(transfer);
      transferRepository.remove = jest.fn().mockResolvedValue({ affected: 1 });
      const result = await transfersService.remove(id);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException', () => {
      transferRepository.findOne = jest.fn().mockResolvedValue(null);
      expect(transfersService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
