import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitsService } from './organizational_units.service';

describe('OrganizationalUnitsService', () => {
  let service: OrganizationalUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationalUnitsService],
    }).compile();

    service = module.get<OrganizationalUnitsService>(
      OrganizationalUnitsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
