import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseHandlerService } from './response-handler.service';
import { UpdateIngredientCategoryDto } from 'src/dto/ingredient-categories/update-ingredient-category.dto';
import { CalendarRecipe } from 'src/entities/calendarRecipe.entity';
import { CreateCalendarRecipeDto } from 'src/dto/calendar-recipes/create-calendar-recipe.dto';
import { UpdateCalendarRecipeDto } from 'src/dto/calendar-recipes/update-calendar-recipe.dto';
import { IngredientCategory } from 'src/entities/ingredientCategory.entity';


@Injectable()
export class CalendarRecipeService {
  constructor(
    @InjectRepository(CalendarRecipe)
    private calendarRecipeRepository: Repository<CalendarRecipe>,
    private responseHandler: ResponseHandlerService,
  ) {}

  findAll(): Promise<CalendarRecipe[]> {
    return this.calendarRecipeRepository.find();
  }

  findOne(id: string): Promise<CalendarRecipe | null> {
    return this.calendarRecipeRepository.findOne({
      where: { id },
    });
  }

  create(
    createCalendarRecipeDto: CreateCalendarRecipeDto ): Promise<CalendarRecipe> {
    const calendarRecipe = this.calendarRecipeRepository.create({
    name: createCalendarRecipeDto.name,
    date: createCalendarRecipeDto.date,
    status: 'pending',
    recipe: { id: createCalendarRecipeDto.recipeId },
    user: { id: createCalendarRecipeDto.userId }
    });
    return this.calendarRecipeRepository.save(calendarRecipe);
  }

  async update(
    id: string,
    updateCalendarRecipeDto: UpdateCalendarRecipeDto,
  ): Promise<CalendarRecipe | null> {
    await this.calendarRecipeRepository.update(id, updateCalendarRecipeDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.calendarRecipeRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

}

