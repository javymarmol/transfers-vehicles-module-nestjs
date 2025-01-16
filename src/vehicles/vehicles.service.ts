import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
  ) {}
  async create(data: CreateVehicleDto) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: data.plate },
    });

    if (existingVehicle) {
      throw new BadRequestException('Vehicle already exists');
    }
    const vehicle = this.vehicleRepository.create(data);
    return this.vehicleRepository.save(vehicle);
  }

  findAll() {
    return this.vehicleRepository.find();
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async update(id: number, changes: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    this.vehicleRepository.merge(vehicle, changes);
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: number) {
    const vehicle = await this.findOne(id);
    return this.vehicleRepository.delete(vehicle.id);
  }
}
