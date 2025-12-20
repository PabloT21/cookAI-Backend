import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { CreateIngredientDto } from '../dto/ingredients/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/ingredients/update-ingredient.dto';
import { ResponseHandlerService } from '../services/response-handler.service';

@Controller('ingredients')
export class IngredientController {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Get()
  async findAll() {
    const ingredients = await this.ingredientService.findAll();
    return this.responseHandler.success(ingredients);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ingredient = await this.ingredientService.findOne(id);
    if (!ingredient) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.success(ingredient);
  }

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    const ingredient = await this.ingredientService.create(createIngredientDto);
    return this.responseHandler.created(ingredient);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    const ingredient = await this.ingredientService.update(
      id,
      updateIngredientDto,
    );
    if (!ingredient) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.updated(ingredient);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.ingredientService.remove(id);
    if (!deleted) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.deleted();
  }
}

