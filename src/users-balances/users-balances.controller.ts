import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersBalancesService } from './users-balances.service';
import { CreateUsersBalanceDto } from './dto/create-users-balance.dto';
import { UpdateUsersBalanceDto } from './dto/update-users-balance.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersBalanceEntity } from './entities/users-balance.entity';

@Controller('users-balances')
@ApiTags('users-balances')
export class UsersBalancesController {
  constructor(private readonly usersBalancesService: UsersBalancesService) {}

  @Post()
  @ApiCreatedResponse({ type: UsersBalanceEntity })
  create(@Body() createUsersBalanceDto: CreateUsersBalanceDto) {
    return this.usersBalancesService.create(createUsersBalanceDto);
  }

  @Get()
  @ApiOkResponse({ type: UsersBalanceEntity, isArray: true })
  findAll() {
    return this.usersBalancesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UsersBalanceEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const usersBalance = await this.usersBalancesService.findOne(id);
    if (!usersBalance) {
      throw new NotFoundException(`UsersBalance with ${id} does not exist.`);
    }
    return usersBalance;
  }

  @Patch(':id')
  @ApiOkResponse({ type: UsersBalanceEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsersBalanceDto: UpdateUsersBalanceDto,
  ) {
    try {
      return await this.usersBalancesService.update(id, updateUsersBalanceDto);
    } catch (error: any) {
      throw new NotFoundException(`UsersBalance with ${id} does not exist.`);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: UsersBalanceEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersBalancesService.remove(id);
    } catch (error: any) {
      throw new NotFoundException(`UsersBalance with ${id} does not exist.`);
    }
  }
}
