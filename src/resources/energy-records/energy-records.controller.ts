import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnergyRecordsService } from './energy-records.service';
import { CreateEnergyRecordDto } from './dto/create-energy-record.dto';

@ApiTags('energy-records')
@Controller('energy-records')
export class EnergyRecordsController {
  constructor(private readonly service: EnergyRecordsService) {}

  @Get()
  @ApiOperation({ summary: 'List all energy production records' })
  @ApiResponse({ status: 200, description: 'Returns an array of records' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':producer')
  @ApiOperation({ summary: 'Get a record by producer address' })
  @ApiParam({ name: 'producer', description: 'Stellar public key of the producer' })
  @ApiResponse({ status: 200, description: 'The energy record' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('producer') producer: string) {
    return this.service.findOne(producer);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new energy production record' })
  @ApiBody({ type: CreateEnergyRecordDto })
  @ApiResponse({ status: 201, description: 'Transaction hash' })
  async create(@Body() dto: CreateEnergyRecordDto) {
    const adminSecret = process.env.ADMIN_SECRET ?? '';
    return this.service.create(dto, adminSecret);
  }
}
