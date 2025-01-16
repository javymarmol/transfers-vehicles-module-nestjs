import { Project } from '../../src/projects/entities/project.entity';
import { faker } from '@faker-js/faker';

export class ProjectsFactory {
  static createMany(count: number, overrides?: Partial<Project>): Project[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static create(overrides?: Partial<Project>): Project {
    return <Project>{
      id: faker.number.int(),
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      users: [],
      organizational_units: [],
      ...overrides,
    };
  }
}
