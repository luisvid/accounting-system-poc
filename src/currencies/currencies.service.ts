import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  create(createCurrencyDto: CreateCurrencyDto) {
    return this.prisma.currency.create({ data: createCurrencyDto });
  }

  findAll() {
    return this.prisma.currency.findMany();
  }

  findOne(id: number) {
    return this.prisma.currency.findUnique({ where: { id } });
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return this.prisma.currency.update({
      where: { id },
      data: updateCurrencyDto,
    });
  }

  remove(id: number) {
    return this.prisma.currency.delete({ where: { id } });
  }
}
