import { Module } from '@nestjs/common';
import { EnergyRecordsController } from './energy-records.controller';
import { EnergyRecordsService } from './energy-records.service';
import { StellarModule } from '../../stellar/stellar.module';

@Module({
  imports: [StellarModule],
  controllers: [EnergyRecordsController],
  providers: [EnergyRecordsService],
})
export class EnergyRecordsModule {}
