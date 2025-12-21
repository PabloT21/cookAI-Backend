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
import { RecipeService } from '../services/recipe.service';
import { CreateCalendarRecipeDto } from '../dto/calendar-recipes/create-calendar-recipe.dto';
import { UpdateCalendarRecipeDto } from '../dto/calendar-recipes/update-calendar-recipe.dto';
import { CalendarRecipeService } from '../services/calendar-recipe.service';
import { ResponseHandlerService } from '../services/response-handler.service';

@Controller('calendar-recipes')
export class CalendarRecipeController {
  constructor(
    private readonly calendarRecipeService: CalendarRecipeService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Get()
  async findAll() {
    try {
      const calendarRecipes = await this.calendarRecipeService.findAll();
      return this.responseHandler.success(calendarRecipes);
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const recipe = await this.calendarRecipeService.findOne(id);
    if (!recipe) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.success(recipe);
  }

  @Post()
  async create(@Body() createCalendarRecipeDto: CreateCalendarRecipeDto) {
    const recipe = await this.calendarRecipeService.create(createCalendarRecipeDto);
    if (!recipe) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.created(recipe);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCalendarRecipeDto: UpdateCalendarRecipeDto,
  ) {
    const calendarRecipe = await this.calendarRecipeService.update(id, updateCalendarRecipeDto);
    if (!calendarRecipe) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.updated(calendarRecipe);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.calendarRecipeService.remove(id);
    if (!deleted) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.deleted();
  }
}

