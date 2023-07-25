import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  Transaction,
  TransactionStatus,
  UserBalance,
  TransactionType,
} from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    try {
      const { userId, transactionTypeId, currencyId, amount, transactionDate } =
        createTransactionDto;

      let balanceAfter = 0;
      // Retrieve the user's current balance
      const userBalance: UserBalance | null =
        await this.prisma.userBalance.findFirst({
          where: {
            userId: userId,
            currencyId: currencyId,
          },
        });

      if (!userBalance) throw new Error('User balance not found');

      // Calculate the new balance after the transaction based on the transaction type
      const transactionType: TransactionType | null =
        await this.prisma.transactionType.findUnique({
          where: {
            id: transactionTypeId,
          },
        });

      if (!transactionType) throw new Error('Transaction type not found');

      if (transactionType.direction === 'INCOME')
        balanceAfter = userBalance.balance + amount;

      if (transactionType.direction === 'EXPENSE')
        balanceAfter = userBalance.balance - amount;

      // Create the transaction
      const transaction: Transaction = await this.prisma.transaction.create({
        data: {
          user: {
            connect: { id: userId },
          },
          transactionType: {
            connect: { id: transactionTypeId },
          },
          currency: {
            connect: { id: currencyId },
          },
          amount: amount,
          transactionDate: transactionDate,
          balanceBefore: userBalance.balance,
          balanceAfter: balanceAfter,
        },
      });

      // Update the user's balance
      await this.prisma.userBalance.update({
        where: {
          id: userBalance.id,
        },
        data: {
          balance: balanceAfter,
        },
      });

      return transaction;
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  create(createTransactionDto: CreateTransactionDto) {
    const createTransactionDtoComplete = {
      ...createTransactionDto,
      balanceBefore: 0,
      balanceAfter: 0,
      status: TransactionStatus.PENDING,
    };
    return this.prisma.transaction.create({
      data: createTransactionDtoComplete,
    });
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findOne(id: number) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  remove(id: number) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
