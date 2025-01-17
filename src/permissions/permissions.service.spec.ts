import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all permissions', async () => {
    const permissions: Partial<Permission>[] = [
      {
        name: 'create_transfers',
        description: 'Create transfers',
        id: 1,
      },
      { name: 'view_transfers', description: 'Read transfers', id: 2 },
      { name: 'edit_transfers', description: 'Update transfers', id: 3 },
      { name: 'delete_transfers', description: 'Delete transfers', id: 4 },
    ];
    const role = new Role();
    role.description = 'Administrator';
    role.name = 'Admin';
    role.permissions = permissions as Permission[];

    jest.spyOn(roleRepository, 'findOne').mockResolvedValueOnce(role);
    const result = await service.getRolePermissions(1);

    expect(result).toEqual(permissions);
    expect(roleRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['permissions'],
    });
  });
});
