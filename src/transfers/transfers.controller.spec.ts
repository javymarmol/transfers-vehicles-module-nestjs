import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { ProjectsService } from '../projects/projects.service';
import { OrganizationalUnitsService } from '../organizational_units/organizational_units.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { UsersService } from '../users/users.service';
import { TransfersFactory } from '../../test/factories/transfers.factory';
import { NotFoundException } from '@nestjs/common';

describe('TransfersController', () => {
  let controller: TransfersController;
  let transferService: TransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        TransfersService,
        {
          provide: getRepositoryToken(Transfer),
          useValue: {},
        },
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
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
    transferService = module.get<TransfersService>(TransfersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transfer', async () => {
      const data = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      const transfer = TransfersFactory.create(data);
      transferService.create = jest.fn().mockResolvedValue(transfer);
      const result = await controller.create(data);
      expect(transferService.create).toHaveBeenCalledWith(data);
      expect(result).toBe(transfer);
      expect(result.project_id).toBe(transfer.project_id);
      expect(result.id).toBe(transfer.id);
    });

    it('should throw an error if transfer creation fails', async () => {
      const data = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      transferService.create = jest.fn().mockRejectedValue(new Error());
      await expect(controller.create(data)).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return an array of transfers', async () => {
      const transfers = TransfersFactory.createMany(2);

      transferService.findAll = jest.fn().mockResolvedValue(transfers);
      const result = await controller.findAll();

      expect(result).toBe(transfers);
      expect(result.length).toBe(2);
    });

    it('should return an array of transfer empty', () => {
      transferService.findAll = jest.fn().mockResolvedValue([]);
      const result = controller.findAll();
      expect(result).resolves.toEqual([]);
      expect(result).resolves.toHaveLength(0);
      expect(transferService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transfer', async () => {
      const transfer = TransfersFactory.create();
      transferService.findOne = jest.fn().mockResolvedValue(transfer);
      const result = await controller.findOne(transfer.id);

      expect(result).toBe(transfer);
      expect(result.id).toBe(transfer.id);
    });

    it('should throw an error if transfer not found', async () => {
      transferService.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Transfer not found'));
      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
      expect(transferService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a transfer', async () => {
      const data = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      const transfer = TransfersFactory.create(data);
      transferService.update = jest.fn().mockResolvedValue(transfer);
      const result = await controller.update(transfer.id, data);
      expect(transferService.update).toHaveBeenCalledWith(transfer.id, data);
      expect(result).toBe(transfer);
      expect(result.id).toBe(transfer.id);
    });

    it('should throw an error if transfer not found', async () => {
      const data = {
        projectId: 1,
        organizationalUnitId: 1,
        clientId: 1,
        transmitterId: 1,
        vehicleId: 1,
        type: 'type',
      };
      transferService.update = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Transfer not found'));
      await expect(controller.update(1, data)).rejects.toThrow(
        NotFoundException,
      );
      expect(transferService.update).toHaveBeenCalledWith(1, data);
    });
  });

  describe('remove', () => {
    it('should remove a transfer', async () => {
      const transfer = TransfersFactory.create();
      transferService.remove = jest.fn().mockResolvedValue(transfer);
      const result = await controller.remove(transfer.id);
      expect(result).toBe(transfer);
      expect(result.id).toBe(transfer.id);
    });

    it('should throw an error if transfer not found', async () => {
      transferService.remove = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Transfer not found'));
      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
      expect(transferService.remove).toHaveBeenCalledWith(1);
    });
  });
});
