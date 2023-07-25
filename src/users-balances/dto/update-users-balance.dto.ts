import { PartialType } from '@nestjs/swagger';
import { CreateUsersBalanceDto } from './create-users-balance.dto';

export class UpdateUsersBalanceDto extends PartialType(CreateUsersBalanceDto) {}
