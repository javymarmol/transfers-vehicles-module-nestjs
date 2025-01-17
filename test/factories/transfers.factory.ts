import { faker } from '@faker-js/faker';
import { Transfer } from '../../src/Transfers/entities/Transfer.entity';

export class TransfersFactory {
  static createMany(count: number, overrides?: Partial<Transfer>): Transfer[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static create(overrides?: Partial<Transfer>): Transfer {
    return <Transfer>{
      id: faker.number.int(),
      type: faker.word.sample(),
      vehicle: null,
      client: null,
      transmitter: null,
      project: null,
      organizationalUnit: null,
      created_at: faker.date.recent(),
      ...overrides,
    };
  }
}
