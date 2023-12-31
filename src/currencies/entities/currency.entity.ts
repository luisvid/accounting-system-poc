import { Currency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// This is an implementation of the Currency type generated by Prisma Client,
// with @ApiProperty decorators added to each property.
export class CurrencyEntity implements Currency {
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  modifiedAt: Date;
}
