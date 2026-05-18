import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnergyRecordsModule } from './resources/energy-records/energy-records.module';
import { StellarModule } from './stellar/stellar.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    StellarModule,
    EnergyRecordsModule,
  ],
})
export class AppModule {}
