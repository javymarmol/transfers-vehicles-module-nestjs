import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrganizationalUnitsService } from './organizational_units.service';
import { CreateOrganizationalUnitDto } from './dto/create-organizational_unit.dto';
import { UpdateOrganizationalUnitDto } from './dto/update-organizational_unit.dto';

@Controller('org-units')
export class OrganizationalUnitsController {
  constructor(
    private readonly organizationalUnitsService: OrganizationalUnitsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrganizationalUnitDto: CreateOrganizationalUnitDto) {
    return this.organizationalUnitsService.create(createOrganizationalUnitDto);
  }

  @Get()
  findAll() {
    return this.organizationalUnitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationalUnitsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationalUnitDto: UpdateOrganizationalUnitDto,
  ) {
    return this.organizationalUnitsService.update(
      id,
      updateOrganizationalUnitDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationalUnitsService.remove(id);
  }
}
