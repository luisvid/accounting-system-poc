import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let lastUserId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        id: 'extUserId1',
        username: 'extUser1',
        name: 'External User',
      };
      const createdUser = {
        ...createUserDto,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(createdUser);
      lastUserId = result.id;
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 'extUserId1',
          username: 'extUser1',
          name: 'External User',
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
        {
          id: 'extUserId2',
          username: 'extUser2',
          name: 'External User 2',
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      ];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(result.length).toBeGreaterThan(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = lastUserId;
      const user = {
        id: 'extUserId1',
        username: 'extUser1',
        name: 'External User',
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.findOne(userId);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = lastUserId;
      const updateUserDto = {
        name: 'External Another User',
      };
      const updatedUser = {
        id: userId,
        username: 'extUser1',
        ...updateUserDto,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = lastUserId;
      const removedUser = {
        id: userId,
        username: 'extUser1',
        name: 'External Another User',
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(removedUser);

      const result = await service.remove(userId);
      expect(result).toEqual(removedUser);
    });
  });
});
