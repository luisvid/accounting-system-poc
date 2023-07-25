import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus } from '@prisma/client';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let lastTransactionId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService, PrismaService],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto = {
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
      };
      const createdTransaction = {
        id: 1,
        ...createTransactionDto,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdTransaction);

      const result = await controller.create(createTransactionDto);
      expect(result).toEqual(createdTransaction);
      lastTransactionId = result.id;
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
      jest.spyOn(service, 'findAll').mockResolvedValue(transactions);

      const result = await controller.findAll();
      expect(result).toEqual(transactions);
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
      jest.spyOn(service, 'findOne').mockResolvedValue(transaction);

      const result = await controller.findOne(transactionId);
      expect(result).toEqual(transaction);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      const transactionId = 1; // Replace with the desired non-existent transaction ID
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(transactionId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const transactionId = lastTransactionId;
      const updateTransactionDto = {
        amount: 150,
      };
      const updatedTransaction = {
        id: transactionId,
        ...updateTransactionDto,
        userId: 'userId1',
        transactionTypeId: 1,
        currencyId: 1,
        transactionDate: new Date(),
        status: TransactionStatus.COMPLETED,
        balanceBefore: 100,
        balanceAfter: 200,
        txnErrorDescription: null,
        paymentProcessorId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(updatedTransaction);

      const result = await controller.update(
        transactionId,
        updateTransactionDto,
      );
      expect(result).toEqual(updatedTransaction);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      const transactionId = 999;
      const updateTransactionDto = {
        amount: 100,
      };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(transactionId, updateTransactionDto),
      ).rejects.toThrow(NotFoundException);
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
        amount: 100,
        transactionDate: new Date(),
        balanceBefore: 100,
        balanceAfter: 200,
        status: TransactionStatus.COMPLETED,
        txnErrorDescription: null,
        paymentProcessorId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'remove').mockResolvedValue(removedTransaction);

      const result = await controller.remove(transactionId);
      expect(result).toEqual(removedTransaction);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      const transactionId = 1; // Replace with the desired non-existent transaction ID
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(transactionId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
