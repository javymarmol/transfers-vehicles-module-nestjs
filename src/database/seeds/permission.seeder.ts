import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../permissions/entities/role.entity';

export default class PermissionSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const permissionRepository = datasource.getRepository(Permission);

    let permissions = await permissionRepository.find();

    if (permissions.length == 0) {
      await permissionRepository.insert([
        { name: 'create_transfers', description: 'Create transfers' },
        { name: 'view_transfers', description: 'Read transfers' },
        { name: 'edit_transfers', description: 'Update transfers' },
        { name: 'delete_transfers', description: 'Delete transfers' },
      ]);

      permissions = await permissionRepository.find();
    }

    const permissionsEditor = permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes('edit') ||
        permission.name.toLowerCase().includes('view'),
    );

    const permissionsViewer = permissions.filter((permission) =>
      permission.name.toLowerCase().includes('view'),
    );

    const roleRepository = datasource.getRepository(Role);

    const roles = await roleRepository.find();

    if (roles.length == 3) return;

    console.log('pass length validation', roles.length == 3);
    let roleAdmin = await roleRepository.findOne({ where: { name: 'Admin' } });

    if (!roleAdmin) {
      roleAdmin = roleRepository.create({
        description: 'Administrator',
        name: 'Admin',
        permissions: permissions,
      });
      roles.push(roleAdmin);
    }

    let roleEditor = await roleRepository.findOne({
      where: { name: 'Editor' },
    });

    if (!roleEditor) {
      roleEditor = roleRepository.create({
        description: 'Editor',
        name: 'Editor',
        permissions: permissionsEditor,
      });
      roles.push(roleEditor);
    }

    let roleViewer = await roleRepository.findOne({
      where: { name: 'Viewer' },
    });

    if (!roleViewer) {
      roleViewer = roleRepository.create({
        description: 'Viewer',
        name: 'Viewer',
        permissions: permissionsViewer,
      });
      roles.push(roleViewer);
    }

    await roleRepository.save(roles);
  }
}
