import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  findAll() {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Patch(':id/toggle-availability')
  toggleAvailability(@Param('id') id: string) {
    return this.ingredientService.toggleAvailability(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const deleted = await this.ingredientService.remove(id);
    if (!deleted) {
      return { message: 'Ingrediente no encontrado' };
    }
    return null;
  }
}

