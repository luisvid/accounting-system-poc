import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { UsersModule } from './users/users.module';
import { TransactionTypesModule } from './transaction-types/transaction-types.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersBalancesModule } from './users-balances/users-balances.module';

@Module({
  imports: [
    PrismaModule,
    CurrenciesModule,
    UsersModule,
    TransactionTypesModule,
    TransactionsModule,
    UsersBalancesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
