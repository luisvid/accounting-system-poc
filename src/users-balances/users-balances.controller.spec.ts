import { Test, TestingModule } from '@nestjs/testing';
import { UsersBalancesController } from './users-balances.controller';
import { UsersBalancesService } from './users-balances.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BalanceStatus } from '@prisma/client';

describe('UsersBalancesController', () => {
  let controller: UsersBalancesController;
  let userBalanceService: UsersBalancesService;
  let lastUserBalanceId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersBalancesController],
      providers: [UsersBalancesService, PrismaService],
    }).compile();

    controller = module.get<UsersBalancesController>(UsersBalancesController);
    userBalanceService = module.get<UsersBalancesService>(UsersBalancesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user balance', async () => {
      const createUsersBalanceDto = {
        userId: 'extUserId1',
        currencyId: 1,
        balance: 100,
        status: BalanceStatus.ACTIVE,
      };
      const createdUserBalance = {
        id: 1,
        ...createUsersBalanceDto,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(userBalanceService, 'create')
        .mockResolvedValue(createdUserBalance);

      const result = await controller.create(createUsersBalanceDto);
      expect(result).toEqual(createdUserBalance);
      lastUserBalanceId = result.id;
    });
  });

  describe('findAll', () => {
    it('should return an array of user balances', async () => {
      const userBalances = [
        {
          id: 1,
          userId: 'extUserId1',
          currencyId: 1,
          balance: 100,
          status: BalanceStatus.ACTIVE,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
        {
          id: 2,
          userId: 'extUserId1',
          currencyId: 2,
          balance: 200,
          status: BalanceStatus.INACTIVE,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      ];
      jest.spyOn(userBalanceService, 'findAll').mockResolvedValue(userBalances);

      const result = await controller.findAll();
      expect(result).toEqual(userBalances);
    });
  });

  describe('findOne', () => {
    it('should return a user balance by id', async () => {
      const userBalanceId = lastUserBalanceId;
      const userBalance = {
        id: userBalanceId,
        userId: 'extUserId1',
        currencyId: 1,
        balance: 100,
        status: BalanceStatus.ACTIVE,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(userBalanceService, 'findOne').mockResolvedValue(userBalance);

      const result = await controller.findOne(userBalanceId);
      expect(result).toEqual(userBalance);
    });

    it('should throw NotFoundException if user balance is not found', async () => {
      const userBalanceId = 1; // Replace with the desired non-existent user balance ID
      jest.spyOn(userBalanceService, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(userBalanceId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user balance', async () => {
      const userBalanceId = lastUserBalanceId;
      const updateUsersBalanceDto = {
        status: BalanceStatus.INACTIVE,
      };
      const updatedUserBalance = {
        id: userBalanceId,
        ...updateUsersBalanceDto,
        userId: 'extUserId1',
        currencyId: 1,
        balance: 100,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(userBalanceService, 'update')
        .mockResolvedValue(updatedUserBalance);

      const result = await controller.update(
        userBalanceId,
        updateUsersBalanceDto,
      );
      expect(result).toEqual(updatedUserBalance);
    });

    it('should throw NotFoundException if user balance is not found', async () => {
      const userBalanceId = 999;
      const updateUsersBalanceDto = {
        status: BalanceStatus.INACTIVE,
      };
      jest
        .spyOn(userBalanceService, 'update')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(userBalanceId, updateUsersBalanceDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user balance', async () => {
      const userBalanceId = lastUserBalanceId;
      const removedUserBalance = {
        id: userBalanceId,
        userId: 'extUserId1',
        currencyId: 1,
        balance: 100,
        status: BalanceStatus.INACTIVE,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest
        .spyOn(userBalanceService, 'remove')
        .mockResolvedValue(removedUserBalance);

      const result = await controller.remove(userBalanceId);
      expect(result).toEqual(removedUserBalance);
    });

    it('should throw NotFoundException if user balance is not found', async () => {
      const userBalanceId = 1; // Replace with the desired non-existent user balance ID
      jest
        .spyOn(userBalanceService, 'remove')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.remove(userBalanceId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
