import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IngredientCategoryService } from '../services/ingredient-category.service';
import { CreateIngredientCategoryDto } from '../dto/create-ingredient-category.dto';
import { UpdateIngredientCategoryDto } from '../dto/update-ingredient-category.dto';

@Controller('ingredient-categories')
export class IngredientCategoryController {
  constructor(
    private readonly categoryService: IngredientCategoryService,
  ) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateIngredientCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateIngredientCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const deleted = await this.categoryService.remove(id);
    if (!deleted) {
      return { message: 'Categoría no encontrada' };
    }
    return null;
  }
}

