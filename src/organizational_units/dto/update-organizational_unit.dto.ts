import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationalUnitDto } from './create-organizational_unit.dto';

export class UpdateOrganizationalUnitDto extends PartialType(
  CreateOrganizationalUnitDto,
) {}
