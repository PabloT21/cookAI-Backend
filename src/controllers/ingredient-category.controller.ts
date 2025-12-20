import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { IngredientCategoryService } from '../services/ingredient-category.service';
import { CreateIngredientCategoryDto } from '../dto/create-ingredient-category.dto';
import { UpdateIngredientCategoryDto } from '../dto/update-ingredient-category.dto';
import { ResponseHandlerService } from '../services/response-handler.service';

@Controller('ingredient-categories')
export class IngredientCategoryController {
  constructor(
    private readonly categoryService: IngredientCategoryService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Get()
  async findAll() {
    const categories = await this.categoryService.findAll();
    return this.responseHandler.success(categories);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.success(category);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateIngredientCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return this.responseHandler.created(category);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateIngredientCategoryDto,
  ) {
    const category = await this.categoryService.update(id, updateCategoryDto);
    if (!category) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.updated(category);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.categoryService.remove(id);
    if (!deleted) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.deleted();
  }
}

