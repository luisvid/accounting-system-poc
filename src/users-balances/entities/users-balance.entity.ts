import { BalanceStatus, UserBalance } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UsersBalanceEntity implements UserBalance {
  id: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  currencyId: number;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  status: BalanceStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  modifiedAt: Date;
}
