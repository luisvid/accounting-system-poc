import { Module } from '@nestjs/common';
import { UsersBalancesService } from './users-balances.service';
import { UsersBalancesController } from './users-balances.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UsersBalancesController],
  providers: [UsersBalancesService],
  imports: [PrismaModule],
})
export class UsersBalancesModule {}
