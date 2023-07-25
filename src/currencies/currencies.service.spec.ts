import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from './currencies.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CurrenciesService', () => {
  let currenciesService: CurrenciesService;
  let lastCurrencyId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesService, PrismaService],
    }).compile();

    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(currenciesService).toBeDefined();
  });

  it('should create a currency', async () => {
    const createCurrencyDto = {
      name: 'USDX',
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    const createdCurrency = await currenciesService.create(createCurrencyDto);
    expect(createdCurrency).toBeDefined();
    expect(createdCurrency.name).toEqual(createCurrencyDto.name);
    lastCurrencyId = createdCurrency.id;
  });

  it('should find all currencies', async () => {
    const currencies = await currenciesService.findAll();
    expect(currencies).toBeDefined();
    expect(currencies.length).toBeGreaterThan(1);
  });

  it('should find one currency by id', async () => {
    const currencyId = lastCurrencyId;
    const currency = await currenciesService.findOne(currencyId);
    expect(currency).toBeDefined();
    expect(currency.id).toEqual(currencyId);
  });

  it('should update a currency', async () => {
    const currencyId = lastCurrencyId;
    const updateCurrencyDto = {
      name: 'USDT',
    };
    const updatedCurrency = await currenciesService.update(
      currencyId,
      updateCurrencyDto,
    );
    expect(updatedCurrency).toBeDefined();
    expect(updatedCurrency.name).toEqual(updateCurrencyDto.name);
  });

  it('should remove a currency', async () => {
    const currencyId = lastCurrencyId;
    const removedCurrency = await currenciesService.remove(currencyId);
    expect(removedCurrency).toBeDefined();
    expect(removedCurrency.id).toEqual(currencyId);
  });
});
