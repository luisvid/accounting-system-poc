import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;
  let service: CurrenciesService;
  let lastCurrencyId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [CurrenciesService, PrismaService],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
    service = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a currency', async () => {
      const createCurrencyDto = {
        name: 'Currency',
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      const createdCurrency = { id: 1, ...createCurrencyDto };
      jest.spyOn(service, 'create').mockResolvedValue(createdCurrency);

      const result = await controller.create(createCurrencyDto);
      expect(result).toEqual(createdCurrency);
      lastCurrencyId = result.id;
    });
  });

  describe('findAll', () => {
    it('should return an array of currencies', async () => {
      const currencies = [
        {
          id: 1,
          name: 'Currency 1',
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
        {
          id: 2,
          name: 'Currency 2',
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(currencies);

      const result = await controller.findAll();
      expect(result).toEqual(currencies);
    });
  });

  describe('findOne', () => {
    it('should return a currency by id', async () => {
      const currencyId = lastCurrencyId;
      const currency = {
        id: currencyId,
        name: 'Currency',
        createdAt: new Date(),
        modifiedAt: new Date(),
      }; // Replace with the expected currency object
      jest.spyOn(service, 'findOne').mockResolvedValue(currency);

      const result = await controller.findOne(currencyId);
      expect(result).toEqual(currency);
    });

    it('should throw NotFoundException if currency is not found', async () => {
      const currencyId = 999;
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(controller.findOne(currencyId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a currency', async () => {
      const currencyId = lastCurrencyId;
      const updateCurrencyDto = {
        name: 'Currency_X',
      };
      const updatedCurrency = {
        id: currencyId,
        ...updateCurrencyDto,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(updatedCurrency);

      const result = await controller.update(currencyId, updateCurrencyDto);
      expect(result).toEqual(updatedCurrency);
    });

    it('should throw NotFoundException if currency is not found', async () => {
      const currencyId = 999;
      const updateCurrencyDto = {
        name: 'Currency_Y',
      };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(currencyId, updateCurrencyDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a currency', async () => {
      const currencyId = lastCurrencyId;
      const removedCurrency = {
        id: currencyId,
        name: 'Currency_X',
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      jest.spyOn(service, 'remove').mockResolvedValue(removedCurrency);

      const result = await controller.remove(currencyId);
      expect(result).toEqual(removedCurrency);
    });

    it('should throw NotFoundException if currency is not found', async () => {
      const currencyId = 999;
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(currencyId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
