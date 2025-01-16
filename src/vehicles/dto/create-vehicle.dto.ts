import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  @ApiProperty()
  plate: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  service: string;
}
