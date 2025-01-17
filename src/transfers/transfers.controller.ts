import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';
import { Permissions } from '../auth/enum/permissions.enum';
import { Request } from 'express';
import { PayloadToken } from '../auth/interfaces/payload-token.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Permission(Permissions.CREATE_TRANSFERS)
  @Post()
  create(@Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

  @Permission(Permissions.VIEW_TRANSFERS)
  @Get()
  findAll(@Req() req: Request) {
    const userReq = req.user as PayloadToken;
    return this.transfersService.findByUser(userReq.sub);
  }

  @Permission(Permissions.VIEW_TRANSFERS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userReq = req.user as PayloadToken;
    return this.transfersService.findOneByUser(id, userReq.sub);
  }

  @Permission(Permissions.EDIT_TRANSFERS)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransferDto: UpdateTransferDto,
    @Req() req: Request,
  ) {
    const userReq = req.user as PayloadToken;
    return this.transfersService.updateByUser(
      id,
      updateTransferDto,
      userReq.sub,
    );
  }

  @Permission(Permissions.DELETE_TRANSFERS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userReq = req.user as PayloadToken;
    return this.transfersService.removeByUser(id, userReq.sub);
  }
}
