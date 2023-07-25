import { Injectable } from '@nestjs/common';
import { CreateTransactionTypeDto } from './dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from './dto/update-transaction-type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionTypesService {
  constructor(private prisma: PrismaService) {}

  create(createTransactionTypeDto: CreateTransactionTypeDto) {
    return this.prisma.transactionType.create({
      data: createTransactionTypeDto,
    });
  }

  findAll() {
    return this.prisma.transactionType.findMany();
  }

  findOne(id: number) {
    return this.prisma.transactionType.findUnique({ where: { id } });
  }

  update(id: number, updateTransactionTypeDto: UpdateTransactionTypeDto) {
    return this.prisma.transactionType.update({
      where: { id },
      data: updateTransactionTypeDto,
    });
  }

  remove(id: number) {
    return this.prisma.transactionType.delete({ where: { id } });
  }
}
