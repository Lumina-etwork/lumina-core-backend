import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateEnergyRecordDto {
  @ApiProperty({ description: 'Stellar public key of the energy producer' })
  @IsString()
  producer: string;

  @ApiProperty({ description: 'Energy amount in kWh' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Unix timestamp of production' })
  @IsNumber()
  timestamp: number;

  @ApiProperty({ description: 'Location or site identifier' })
  @IsString()
  location: string;
}
