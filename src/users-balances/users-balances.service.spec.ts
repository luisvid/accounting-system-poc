import { Test, TestingModule } from '@nestjs/testing';
import { UsersBalancesService } from './users-balances.service';
import { PrismaService } from '../prisma/prisma.service';
import { BalanceStatus } from '@prisma/client';

describe('UsersBalancesService', () => {
  let service: UsersBalancesService;
  let prismaService: PrismaService;
  let lastUserBalanceId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersBalancesService, PrismaService],
    }).compile();

    service = module.get<UsersBalancesService>(UsersBalancesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        .spyOn(prismaService.userBalance, 'create')
        .mockResolvedValue(createdUserBalance);

      const result = await service.create(createUsersBalanceDto);
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
          status: BalanceStatus.ACTIVE,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      ];
      jest
        .spyOn(prismaService.userBalance, 'findMany')
        .mockResolvedValue(userBalances);

      const result = await service.findAll();
      expect(result).toEqual(userBalances);
      expect(result.length).toBeGreaterThan(1);
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
      jest
        .spyOn(prismaService.userBalance, 'findUnique')
        .mockResolvedValue(userBalance);

      const result = await service.findOne(userBalanceId);
      expect(result).toEqual(userBalance);
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
        .spyOn(prismaService.userBalance, 'update')
        .mockResolvedValue(updatedUserBalance);

      const result = await service.update(userBalanceId, updateUsersBalanceDto);
      expect(result).toEqual(updatedUserBalance);
      expect(result.status).toEqual(BalanceStatus.INACTIVE);
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
        .spyOn(prismaService.userBalance, 'delete')
        .mockResolvedValue(removedUserBalance);

      const result = await service.remove(userBalanceId);
      expect(result).toEqual(removedUserBalance);
    });
  });
});
