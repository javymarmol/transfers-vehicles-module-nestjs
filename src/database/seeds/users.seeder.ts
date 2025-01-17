import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

import { Role } from '../../permissions/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { OrganizationalUnit } from '../../organizational_units/entities/organizational_unit.entity';

export default class UsersSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const roleRepository = datasource.getRepository(Role);

    const roles = await roleRepository.find();

    if (roles.length == 0) return;

    const usersRepository = datasource.getRepository(User);

    const users = await usersRepository.find({
      relations: ['role'],
      where: [
        { username: 'admin' },
        { username: 'editor' },
        { username: 'viewer' },
      ],
    });

    if (users.length == 3) return;

    const userAdmin = users.find((user) => user.username === 'admin');
    const userEditor = users.find((user) => user.username === 'editor');
    const userViewer = users.find((user) => user.username === 'viewer');

    const projectRepository = datasource.getRepository(Project);
    const projects = await projectRepository.find();

    const UnitRepository = datasource.getRepository(OrganizationalUnit);
    const units = await UnitRepository.find();

    if (!userAdmin) {
      const roleAdmin = roles.find((role) => role.name === 'Admin');
      const user = usersRepository.create({
        username: 'admin',
        email: 'admin@email.com',
        role: roleAdmin,
        projects: projects,
        organizational_units: units,
      });
      user.password_hash = await bcrypt.hash('Admin123/', 10);
      await usersRepository.save(user);
    }

    if (!userEditor) {
      const roleEditor = roles.find((role) => role.name === 'Editor');
      const user = usersRepository.create({
        username: 'editor',
        email: 'editor@email.com',
        role: roleEditor,
        projects: projects,
        organizational_units: units,
      });
      user.password_hash = await bcrypt.hash('Editor123/', 10);
      await usersRepository.save(user);
    }

    if (!userViewer) {
      const roleViewer = roles.find((role) => role.name === 'Viewer');
      const user = usersRepository.create({
        username: 'viewer',
        email: 'viewer@email.com',
        role: roleViewer,
        projects: projects,
        organizational_units: units,
      });
      user.password_hash = await bcrypt.hash('Viewer123/', 10);
      await usersRepository.save(user);
    }
  }
}
