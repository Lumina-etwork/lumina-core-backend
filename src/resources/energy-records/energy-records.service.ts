import { Injectable, NotFoundException } from '@nestjs/common';
import { StellarService } from '../../stellar/stellar.service';
import { CreateEnergyRecordDto } from './dto/create-energy-record.dto';

@Injectable()
export class EnergyRecordsService {
  constructor(private readonly stellar: StellarService) {}

  async findAll(): Promise<any[]> {
    try {
      const result = await this.stellar.simulateTransaction('get_all_records');
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  }

  async findOne(producer: string): Promise<any> {
    try {
      const result = await this.stellar.simulateTransaction('get_record', producer);
      return result;
    } catch {
      throw new NotFoundException(`Record for producer ${producer} not found`);
    }
  }

  async create(dto: CreateEnergyRecordDto, adminSecret: string): Promise<string> {
    return this.stellar.submitTransaction(
      'record_production',
      adminSecret,
      dto.producer,
      dto.amount,
      dto.timestamp,
      dto.location,
    );
  }
}
