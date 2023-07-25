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
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyEntity } from './entities/currency.entity';

@Controller('currencies')
@ApiTags('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @ApiCreatedResponse({ type: CurrencyEntity })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @ApiOkResponse({ type: CurrencyEntity, isArray: true })
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CurrencyEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const currency = await this.currenciesService.findOne(id);
    if (!currency) {
      throw new NotFoundException(`Currency with ${id} does not exist.`);
    }
    return currency;
  }

  @Patch(':id')
  @ApiOkResponse({ type: CurrencyEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    try {
      return await this.currenciesService.update(id, updateCurrencyDto);
    } catch (error: any) {
      throw new NotFoundException(`Currency with ${id} does not exist.`);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: CurrencyEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.currenciesService.remove(id);
    } catch (error: any) {
      throw new NotFoundException(`Currency with ${id} does not exist.`);
    }
  }
}
