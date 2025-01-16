import { faker } from '@faker-js/faker';
import { User } from '../../src/users/entities/user.entity';

export class UsersFactory {
  static createMany(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static create(overrides?: Partial<User>): User {
    return {
      id: faker.number.int(),
      username: faker.internet.displayName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      created_at: faker.date.recent(),
      projects: [],
      ...overrides,
    };
  }
}
