import { faker } from '@faker-js/faker';
import { OrganizationalUnit } from '../../src/organizational_units/entities/organizational_unit.entity';

export class OrganizationalUnitsFactory {
  static createMany(
    count: number,
    overrides?: Partial<OrganizationalUnit>,
  ): OrganizationalUnit[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static create(overrides?: Partial<OrganizationalUnit>): OrganizationalUnit {
    return <OrganizationalUnit>{
      id: faker.number.int(),
      name: faker.word.sample(),
      project: null,
      users: [],
      ...overrides,
    };
  }
}
