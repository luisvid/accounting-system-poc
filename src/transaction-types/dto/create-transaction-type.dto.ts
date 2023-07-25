import { ApiProperty } from '@nestjs/swagger';
import { TransactionDirection } from '@prisma/client';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTransactionTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    enum: TransactionDirection,
    default: TransactionDirection.INCOME,
  })
  direction: TransactionDirection;
}
