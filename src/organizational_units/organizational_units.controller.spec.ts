import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitsController } from './organizational_units.controller';
import { OrganizationalUnitsService } from './organizational_units.service';

describe('OrganizationalUnitsController', () => {
  let controller: OrganizationalUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationalUnitsController],
      providers: [OrganizationalUnitsService],
    }).compile();

    controller = module.get<OrganizationalUnitsController>(
      OrganizationalUnitsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
