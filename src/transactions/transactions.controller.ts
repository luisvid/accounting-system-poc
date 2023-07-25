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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransactionEntity } from './entities/transaction.entity';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiCreatedResponse({ type: TransactionEntity })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      const transaction =
        this.transactionsService.createTransaction(createTransactionDto);
      if (!transaction)
        throw new NotFoundException(`Error creating Transaction.`);

      return transaction;
    } catch (error: any) {
      throw new NotFoundException(`Error creating Transaction.${error}`);
    }
  }

  // only for testing
  @ApiCreatedResponse({ type: TransactionEntity })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOkResponse({ type: TransactionEntity, isArray: true })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TransactionEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const transaction = await this.transactionsService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
    return transaction;
  }

  @Patch(':id')
  @ApiOkResponse({ type: TransactionEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    try {
      return await this.transactionsService.update(id, updateTransactionDto);
    } catch (error: any) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: TransactionEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.transactionsService.remove(id);
    } catch (error: any) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
  }
}
