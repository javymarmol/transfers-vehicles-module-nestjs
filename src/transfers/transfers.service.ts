import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { ProjectsService } from '../projects/projects.service';
import { OrganizationalUnitsService } from '../organizational_units/organizational_units.service';
import { In, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { OrganizationalUnit } from '../organizational_units/entities/organizational_unit.entity';

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
    return await this.transferRepository.find({
      relations: [
        'project',
        'organizationalUnit',
        'client',
        'transmitter',
        'vehicle',
      ],
    });
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

  async findByUser(userId: number) {
    const user = await this.usersService.findOne(userId);
    console.log(user);
    return this.transferRepository.find({
      where: [
        { project: In(user.projects.map((p) => p.id)) },
        {
          organizationalUnit: In(user.organizational_units.map((ou) => ou.id)),
        },
      ],
      relations: [
        'project',
        'organizationalUnit',
        'client',
        'transmitter',
        'vehicle',
      ],
      loadRelationIds: true,
    });
  }

  async findByOrgUnits(orgUnits: OrganizationalUnit[]) {
    return this.transferRepository.find({
      where: { organizationalUnit: In(orgUnits.map((ou) => ou.id)) },
      relations: [
        'project',
        'organizationalUnit',
        'client',
        'transmitter',
        'vehicle',
      ],
      loadRelationIds: true,
    });
  }

  async findOneByUser(id: number, userId: number) {
    const user = await this.usersService.findOne(userId);
    return this.transferRepository.findOne({
      where: {
        id,
        organizationalUnit: In(user.organizational_units.map((ou) => ou.id)),
        project: In(user.projects.map((p) => p.id)),
      },
      relations: [
        'project',
        'organizationalUnit',
        'client',
        'transmitter',
        'vehicle',
      ],
      loadRelationIds: true,
    });
  }

  async updateByUser(
    id: number,
    updateTransferDto: UpdateTransferDto,
    userId: number,
  ) {
    const user = await this.usersService.findOne(userId);
    const project = user.projects.find(
      (project) => project.id === updateTransferDto.projectId,
    );
    if (!project) {
      throw new ForbiddenException('You do not have permission to the project');
    }

    const orgUnit = user.organizational_units.find(
      (unit) => unit.id === updateTransferDto.organizationalUnitId,
    );
    if (!orgUnit) {
      throw new ForbiddenException(
        'You do not have permission to the organizational unit',
      );
    }

    return this.update(id, updateTransferDto);
  }

  async removeByUser(id: number, userId: number) {
    const user = await this.usersService.findOne(userId);
    const transfer = await this.findOne(id);
    const belongsToOrgUnit = user.organizational_units.some(
      (unit) => unit.id === transfer.organizationalUnit.id,
    );
    if (!belongsToOrgUnit) {
      throw new ForbiddenException(
        'You do not have permission to the organizational unit',
      );
    }
    return this.remove(id);
  }
}
