import { ApiProperty } from '@nestjs/swagger';
// import { TransactionStatus } from '@prisma/client';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  // IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  transactionTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  currencyId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  transactionDate: Date;
}
