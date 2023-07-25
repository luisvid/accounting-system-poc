import { Transaction, TransactionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntity implements Transaction {
  id: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  transactionTypeId: number;

  @ApiProperty()
  currencyId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  transactionDate: Date;

  @ApiProperty()
  balanceBefore: number;

  @ApiProperty()
  balanceAfter: number;

  @ApiProperty()
  status: TransactionStatus;

  @ApiProperty()
  txnErrorDescription: string;

  @ApiProperty()
  paymentProcessorId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  modifiedAt: Date;
}
