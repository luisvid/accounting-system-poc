import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TransactionTypesService } from './transaction-types.service';
import { CreateTransactionTypeDto } from './dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from './dto/update-transaction-type.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransactionTypeEntity } from './entities/transaction-type.entity';

@Controller('transaction-types')
@ApiTags('transaction-types')
export class TransactionTypesController {
  constructor(
    private readonly transactionTypesService: TransactionTypesService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: TransactionTypeEntity })
  create(@Body() createTransactionTypeDto: CreateTransactionTypeDto) {
    return this.transactionTypesService.create(createTransactionTypeDto);
  }

  @Get()
  @ApiOkResponse({ type: TransactionTypeEntity, isArray: true })
  findAll() {
    return this.transactionTypesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TransactionTypeEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const transactionType = await this.transactionTypesService.findOne(id);
    if (!transactionType) {
      throw new NotFoundException(
        `Transaction Type with ${id} does not exist.`,
      );
    }
    return transactionType;
  }

  @Patch(':id')
  @ApiOkResponse({ type: TransactionTypeEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionTypeDto: UpdateTransactionTypeDto,
  ) {
    try {
      return this.transactionTypesService.update(id, updateTransactionTypeDto);
    } catch (error: any) {
      throw new NotFoundException(
        `Transaction Type with ${id} does not exist.`,
      );
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: TransactionTypeEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.transactionTypesService.remove(id);
    } catch (error: any) {
      throw new NotFoundException(
        `Transaction Type with ${id} does not exist.`,
      );
    }
  }
}
