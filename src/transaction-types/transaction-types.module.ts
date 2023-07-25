import { Module } from '@nestjs/common';
import { TransactionTypesService } from './transaction-types.service';
import { TransactionTypesController } from './transaction-types.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TransactionTypesController],
  providers: [TransactionTypesService],
  imports: [PrismaModule],
})
export class TransactionTypesModule {}
