import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitsController } from './organizational_units.controller';
import { OrganizationalUnitsService } from './organizational_units.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('OrganizationalUnitsController', () => {
  let controller: OrganizationalUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationalUnitsController],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === OrganizationalUnitsService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<OrganizationalUnitsController>(
      OrganizationalUnitsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
