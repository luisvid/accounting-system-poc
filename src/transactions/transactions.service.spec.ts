import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BalanceStatus,
  Transaction,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;
  let lastTransactionId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService, PrismaService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto = {
        userId: 'userId1',
        transactionTypeId: 1,
        currencyId: 1,
        amount: 100,
        balanceBefore: 100,
        balanceAfter: 200,
        status: TransactionStatus.PENDING,
        transactionDate: new Date(),
      };
      const createdTransaction = {
        id: 1,
        ...createTransactionDto,
        txnErrorDescription: null,
        paymentProcessorId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(prismaService.transaction, 'create')
        .mockResolvedValue(createdTransaction);

      const result = await service.create(createTransactionDto);
      expect(result).toEqual(createdTransaction);
      lastTransactionId = result.id;
    });

    it('should complete and create a transaction', async () => {
      const createTransactionDto = {
        userId: 'userId1',
        transactionTypeId: 1,
        currencyId: 1,
        amount: 100,
        transactionDate: new Date(),
      };

      const userBalance = {
        id: 1,
        userId: 'userId1',
        currencyId: 1,
        balance: 100,
        status: BalanceStatus.ACTIVE,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      const createdTransaction: Transaction = {
        id: 1,
        ...createTransactionDto,
        balanceBefore: userBalance.balance,
        balanceAfter: userBalance.balance + createTransactionDto.amount,
        status: TransactionStatus.PENDING,
        txnErrorDescription: null,
        paymentProcessorId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      const TransactionType: TransactionType = {
        id: 1,
        name: 'Deposit',
        direction: TransactionDirection.INCOME,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      jest
        .spyOn(prismaService.transactionType, 'findUnique')
        .mockResolvedValue(TransactionType);
      jest
        .spyOn(prismaService.userBalance, 'findFirst')
        .mockResolvedValue(userBalance);
      jest
        .spyOn(prismaService.transaction, 'create')
        .mockResolvedValue(createdTransaction);
      jest
        .spyOn(prismaService.userBalance, 'update')
        .mockResolvedValue(userBalance);

      const result = await service.createTransaction(createTransactionDto);

      expect(result).toEqual(createdTransaction);
      expect(prismaService.userBalance.findFirst).toHaveBeenCalledWith({
        where: {
          userId: createTransactionDto.userId,
          currencyId: createTransactionDto.currencyId,
        },
      });
      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          user: {
            connect: { id: createTransactionDto.userId },
          },
          transactionType: {
            connect: { id: createTransactionDto.transactionTypeId },
          },
          currency: {
            connect: { id: createTransactionDto.currencyId },
          },
          amount: createTransactionDto.amount,
          transactionDate: createTransactionDto.transactionDate,
          balanceBefore: userBalance.balance,
          balanceAfter: userBalance.balance + createTransactionDto.amount,
        },
      });
      expect(prismaService.userBalance.update).toHaveBeenCalledWith({
        where: {
          id: userBalance.id,
        },
        data: {
          balance: userBalance.balance + createTransactionDto.amount,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions = [
        {
          id: 1,
          userId: 'userId1',
          transactionTypeId: 1,
          currencyId: 1,
          amount: 100,
          transactionDate: new Date(),
          balanceBefore: 100,
          balanceAfter: 200,
          status: TransactionStatus.PENDING,
          txnErrorDescription: null,
          paymentProcessorId: null,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
        {
          id: 2,
          userId: 'userId2',
          transactionTypeId: 2,
          currencyId: 2,
          amount: 100,
          transactionDate: new Date(),
          balanceBefore: 100,
          balanceAfter: 200,
          status: TransactionStatus.FAILED,
          txnErrorDescription: null,
          paymentProcessorId: null,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      ];
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(transactions);

      const result = await service.findAll();
      expect(result).toEqual(transactions);
      expect(result.length).toBeGreaterThan(1);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const transactionId = lastTransactionId;
      const transaction = {
        id: transactionId,
        userId: 'userId1',
        transactionTypeId: 1,
        currencyId: 1,
        amount: 100,
        transactionDate: new Date(),
        balanceBefore: 100,
        balanceAfter: 200,
        status: TransactionStatus.PENDING,
        txnErrorDescription: null,
        paymentProcessorId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(prismaService.transaction, 'findUnique')
        .mockResolvedValue(transaction);

      const result = await service.findOne(transactionId);
      expect(result).toEqual(transaction);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const transactionId = lastTransactionId;
      const updateTransactionDto = {
        amount: 200,
      };
      const updatedTransaction = {
        id: transactionId,
        ...updateTransactionDto,
        userId: 'userId1',
        transactionTypeId: 1,
        currencyId: 1,
        transactionDate: new Date(),
        balanceBefore: 100,
        balanceAfter: 200,
        status: TransactionStatus.PENDING,
        txnErrorDescription: null,
        paymentProcessorId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(prismaService.transaction, 'update')
        .mockResolvedValue(updatedTransaction);

      const result = await service.update(transactionId, updateTransactionDto);
      expect(result).toEqual(updatedTransaction);
      expect(result.amount).toEqual(200);
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const transactionId = lastTransactionId;
      const removedTransaction = {
        id: transactionId,
        userId: 'userId1',
        transactionTypeId: 1,
        currencyId: 1,
        amount: 200,
        transactionDate: new Date(),
        balanceBefore: 100,
        balanceAfter: 200,
        status: TransactionStatus.PENDING,
        txnErrorDescription: null,
        paymentProcessorId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(prismaService.transaction, 'delete')
        .mockResolvedValue(removedTransaction);

      const result = await service.remove(transactionId);
      expect(result).toEqual(removedTransaction);
    });
  });
});
