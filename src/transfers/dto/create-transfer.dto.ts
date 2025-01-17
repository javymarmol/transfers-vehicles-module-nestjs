import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  vehicleId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  clientId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  transmitterId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  projectId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  organizationalUnitId: number;
}
