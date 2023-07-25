import { TransactionDirection, TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionTypeEntity implements TransactionType {
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  direction: TransactionDirection;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  modifiedAt: Date;
}
