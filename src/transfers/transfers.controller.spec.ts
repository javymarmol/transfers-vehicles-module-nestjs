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
import { Request } from 'express';
import { UsersFactory } from '../../test/factories/users.factory';
import { ProjectsFactory } from '../../test/factories/projects.factory';
import { OrganizationalUnitsFactory } from '../../test/factories/organizational-units.factory';
import { PayloadToken } from '../auth/interfaces/payload-token.interface';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../../config/auth.config';
import { ConfigType } from '@nestjs/config';

describe('TransfersController', () => {
  let controller: TransfersController;
  let transferService: TransfersService;
  let userService: UsersService;
  const authConfiguration: ConfigType<typeof authConfig> = {
    jwtAccessTokenSecret: '231231dwddfr',
    jwtAccessTokenExpirationTime: '1d',
  };

  const mockRequest = {
    user: {
      sub: 1,
      role: 1,
    },
    sub: 1,
    body: {
      sub: 1,
      firstName: 'J',
      lastName: 'Doe',
      email: 'jdoe@abc123.com',
      password: 'Abcd1234',
      passwordConfirm: 'Abcd1234',
      company: 'ABC Inc.',
    },
  } as unknown as Request;

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
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: authConfig,
          useValue: authConfiguration,
        },
        {
          provide: authConfig.KEY,
          useValue: authConfiguration,
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
    transferService = module.get<TransfersService>(TransfersService);
    userService = module.get<UsersService>(UsersService);
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
      const user = UsersFactory.create();
      const projects = ProjectsFactory.createMany(3);
      const units = OrganizationalUnitsFactory.createMany(3, {
        project: projects[0],
      });
      user.projects = projects;
      user.organizational_units = units;
      const transfers = TransfersFactory.createMany(2, {
        project: projects[0],
        organizationalUnit: units[0],
      });

      userService.findOne = jest.fn().mockResolvedValue(user);
      transferService.findByUser = jest.fn().mockResolvedValue(transfers);

      const result = await controller.findAll(mockRequest);

      expect(result).toBe(transfers);
      expect(result.length).toBe(2);
    });

    it('should return an array of transfer empty', () => {
      transferService.findByUser = jest.fn().mockResolvedValue([]);
      const result = controller.findAll(mockRequest);
      expect(result).resolves.toEqual([]);
      expect(result).resolves.toHaveLength(0);
      expect(transferService.findByUser).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transfer', async () => {
      const user = UsersFactory.create({ id: 1 });
      const projects = ProjectsFactory.createMany(3);
      const units = OrganizationalUnitsFactory.createMany(3, {
        project: projects[0],
      });
      user.projects = projects;
      user.organizational_units = units;
      const transfer = TransfersFactory.create({
        project: projects[0],
        organizationalUnit: units[0],
      });
      transferService.findOneByUser = jest.fn().mockResolvedValue(transfer);
      const result = await controller.findOne(transfer.id, mockRequest);

      expect(result).toBe(transfer);
      expect(result.id).toBe(transfer.id);
    });

    it('should throw an error if transfer not found', async () => {
      transferService.findOneByUser = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Transfer not found'));
      await expect(controller.findOne(1, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(transferService.findOneByUser).toHaveBeenCalledWith(1, 1);
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
      const user = mockRequest.user as PayloadToken;
      const transfer = TransfersFactory.create(data);
      transferService.updateByUser = jest.fn().mockResolvedValue(transfer);
      const result = await controller.update(transfer.id, data, mockRequest);
      expect(transferService.updateByUser).toHaveBeenCalledWith(
        transfer.id,
        data,
        user.sub,
      );
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
      transferService.updateByUser = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Transfer not found'));
      await expect(controller.update(1, data, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(transferService.updateByUser).toHaveBeenCalledWith(1, data, 1);
    });
  });

  describe('remove', () => {
    it('should remove a transfer', async () => {
      const transfer = TransfersFactory.create();
      transferService.removeByUser = jest.fn().mockResolvedValue(transfer);
      const result = await controller.remove(transfer.id, mockRequest);
      expect(result).toBe(transfer);
      expect(result.id).toBe(transfer.id);
    });

    it('should throw an error if transfer not found', async () => {
      transferService.removeByUser = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Transfer not found'));
      await expect(controller.remove(1, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(transferService.removeByUser).toHaveBeenCalledWith(1, 1);
    });
  });
});
