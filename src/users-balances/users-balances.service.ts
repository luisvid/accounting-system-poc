import { Injectable } from '@nestjs/common';
import { CreateUsersBalanceDto } from './dto/create-users-balance.dto';
import { UpdateUsersBalanceDto } from './dto/update-users-balance.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersBalancesService {
  constructor(private prisma: PrismaService) {}

  create(createUsersBalanceDto: CreateUsersBalanceDto) {
    return this.prisma.userBalance.create({ data: createUsersBalanceDto });
  }

  findAll() {
    return this.prisma.userBalance.findMany();
  }

  findOne(id: number) {
    return this.prisma.userBalance.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUsersBalanceDto: UpdateUsersBalanceDto) {
    return this.prisma.userBalance.update({
      where: { id },
      data: updateUsersBalanceDto,
    });
  }

  remove(id: number) {
    return this.prisma.userBalance.delete({ where: { id } });
  }
}
