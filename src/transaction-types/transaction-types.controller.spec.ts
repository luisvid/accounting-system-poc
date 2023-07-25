import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTypesController } from './transaction-types.controller';
import { TransactionTypesService } from './transaction-types.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionDirection } from '@prisma/client';

describe('TransactionTypesController', () => {
  let controller: TransactionTypesController;
  let service: TransactionTypesService;
  let lasTransactionTypeId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionTypesController],
      providers: [TransactionTypesService, PrismaService],
    }).compile();

    controller = module.get<TransactionTypesController>(
      TransactionTypesController,
    );
    service = module.get<TransactionTypesService>(TransactionTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction type', async () => {
      const createTransactionTypeDto = {
        name: 'Transaction Type',
        direction: TransactionDirection.INCOME,
      };
      const createdTransactionType = {
        id: 1,
        ...createTransactionTypeDto,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdTransactionType);

      const result = await controller.create(createTransactionTypeDto);
      expect(result).toEqual(createdTransactionType);
      lasTransactionTypeId = result.id;
    });
  });

  describe('findAll', () => {
    it('should return an array of transaction types', async () => {
      const transactionTypes = [
        {
          id: 1,
          name: 'Transaction Type 1',
          direction: TransactionDirection.INCOME,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
        {
          id: 2,
          name: 'Transaction Type 2',
          direction: TransactionDirection.EXPENSE,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(transactionTypes);

      const result = await controller.findAll();
      expect(result).toEqual(transactionTypes);
    });
  });

  describe('findOne', () => {
    it('should return a transaction type by id', async () => {
      const transactionTypeId = lasTransactionTypeId;
      const transactionType = {
        id: transactionTypeId,
        name: 'Transaction Type',
        direction: TransactionDirection.INCOME,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(transactionType);

      const result = await controller.findOne(transactionTypeId);
      expect(result).toEqual(transactionType);
    });

    it('should throw NotFoundException if transaction type is not found', async () => {
      const transactionTypeId = 1; // Replace with the desired non-existent transaction type ID
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(transactionTypeId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a transaction type', async () => {
      const transactionTypeId = lasTransactionTypeId;
      const updateTransactionTypeDto = {
        name: 'Transaction Type Updated',
      };
      const updatedTransactionType = {
        id: transactionTypeId,
        ...updateTransactionTypeDto,
        direction: TransactionDirection.INCOME,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(updatedTransactionType);

      const result = await controller.update(
        transactionTypeId,
        updateTransactionTypeDto,
      );
      expect(result).toEqual(updatedTransactionType);
    });

    it('should throw NotFoundException if transaction type is not found', async () => {
      const transactionTypeId = 999;
      const updateTransactionTypeDto = {
        name: 'Transaction Type Updated',
      };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(transactionTypeId, updateTransactionTypeDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a transaction type', async () => {
      const transactionTypeId = lasTransactionTypeId;
      const removedTransactionType = {
        id: transactionTypeId,
        name: 'Transaction Type Updated',
        direction: TransactionDirection.INCOME,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'remove').mockResolvedValue(removedTransactionType);

      const result = await controller.remove(transactionTypeId);
      expect(result).toEqual(removedTransactionType);
    });

    it('should throw NotFoundException if transaction type is not found', async () => {
      const transactionTypeId = 1; // Replace with the desired non-existent transaction type ID
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(transactionTypeId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
