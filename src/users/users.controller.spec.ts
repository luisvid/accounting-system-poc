import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let lastUserId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);
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
      ]; // Replace with the expected array of users
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
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
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne(userId);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '1'; // Replace with the desired non-existent user ID
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
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
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'nonExistentId'; // Replace with the desired non-existent user ID
      const updateUserDto = {
        name: 'External nonExistent User',
      };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
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
      jest.spyOn(service, 'remove').mockResolvedValue(removedUser);

      const result = await controller.remove(userId);
      expect(result).toEqual(removedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '1'; // Replace with the desired non-existent user ID
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
