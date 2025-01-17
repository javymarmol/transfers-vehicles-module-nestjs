import { faker } from '@faker-js/faker';
import { Vehicle } from '../../src/vehicles/entities/vehicle.entity';

export class VehiclesFactory {
  static createMany(count: number, overrides?: Partial<Vehicle>): Vehicle[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static create(overrides?: Partial<Vehicle>): Vehicle {
    return <Vehicle>{
      id: faker.number.int(),
      plate: faker.vehicle.vrm(),
      service: faker.vehicle.type(),
      created_at: faker.date.recent(),
      ...overrides,
    };
  }
}
