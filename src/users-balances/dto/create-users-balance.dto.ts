import { ApiProperty } from '@nestjs/swagger';
import { BalanceStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUsersBalanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  currencyId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  balance: number;

  @IsNotEmpty()
  @ApiProperty({ enum: BalanceStatus, default: BalanceStatus.ACTIVE })
  status: BalanceStatus;
}
