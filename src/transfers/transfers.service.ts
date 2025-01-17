import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { ProjectsService } from '../projects/projects.service';
import { OrganizationalUnitsService } from '../organizational_units/organizational_units.service';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    private readonly projectsService: ProjectsService,
    private readonly organizationalUnitsService: OrganizationalUnitsService,
    private readonly usersService: UsersService,
    private readonly vehiclesService: VehiclesService,
  ) {}
  async create(data: CreateTransferDto) {
    const project = await this.projectsService.findOne(data.projectId);
    const orgUnit = await this.organizationalUnitsService.findOne(
      data.organizationalUnitId,
    );
    const client = await this.usersService.findOne(data.clientId);
    const transmitter = await this.usersService.findOne(data.transmitterId);
    const vehicle = await this.vehiclesService.findOne(data.vehicleId);

    const transfer = this.transferRepository.create(data);
    transfer.project = project;
    transfer.organizationalUnit = orgUnit;
    transfer.client = client;
    transfer.transmitter = transmitter;
    transfer.vehicle = vehicle;

    return this.transferRepository.save(transfer);
  }

  async findAll() {
    return await this.transferRepository.find();
  }

  async findOne(id: number) {
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: [
        'project',
        'organizationalUnit',
        'client',
        'transmitter',
        'vehicle',
      ],
    });
    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    return transfer;
  }

  async update(id: number, changes: UpdateTransferDto) {
    const transfer = await this.findOne(id);
    if (changes.projectId) {
      transfer.project = await this.projectsService.findOne(changes.projectId);
    }

    if (changes.organizationalUnitId) {
      transfer.organizationalUnit =
        await this.organizationalUnitsService.findOne(
          changes.organizationalUnitId,
        );
    }

    if (changes.clientId) {
      transfer.client = await this.usersService.findOne(changes.clientId);
    }

    if (changes.transmitterId) {
      transfer.transmitter = await this.usersService.findOne(
        changes.transmitterId,
      );
    }

    if (changes.vehicleId) {
      transfer.vehicle = await this.vehiclesService.findOne(changes.vehicleId);
    }

    this.transferRepository.merge(transfer, changes);
    return this.transferRepository.save(transfer);
  }

  async remove(id: number) {
    const transfer = await this.findOne(id);
    return this.transferRepository.remove(transfer);
  }
}
