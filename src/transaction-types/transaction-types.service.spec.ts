import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTypesService } from './transaction-types.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionDirection } from '@prisma/client';

describe('TransactionTypesService', () => {
  let service: TransactionTypesService;
  let prismaService: PrismaService;
  let lasTransactionTypeId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionTypesService, PrismaService],
    }).compile();

    service = module.get<TransactionTypesService>(TransactionTypesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      jest
        .spyOn(prismaService.transactionType, 'create')
        .mockResolvedValue(createdTransactionType);

      const result = await service.create(createTransactionTypeDto);
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
      jest
        .spyOn(prismaService.transactionType, 'findMany')
        .mockResolvedValue(transactionTypes);

      const result = await service.findAll();
      expect(result).toEqual(transactionTypes);
      expect(result.length).toBeGreaterThan(1);
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
      jest
        .spyOn(prismaService.transactionType, 'findUnique')
        .mockResolvedValue(transactionType);

      const result = await service.findOne(transactionTypeId);
      expect(result).toEqual(transactionType);
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
      jest
        .spyOn(prismaService.transactionType, 'update')
        .mockResolvedValue(updatedTransactionType);

      const result = await service.update(
        transactionTypeId,
        updateTransactionTypeDto,
      );
      expect(result).toEqual(updatedTransactionType);
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
      jest
        .spyOn(prismaService.transactionType, 'delete')
        .mockResolvedValue(removedTransactionType);

      const result = await service.remove(transactionTypeId);
      expect(result).toEqual(removedTransactionType);
    });
  });
});
