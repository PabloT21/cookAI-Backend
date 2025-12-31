import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

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

  async findByRangeDate(
    initialDate: Date,
    endDate?: Date,
  ): Promise<CalendarRecipe[]> {
    try {
      // Si no se proporciona endDate, usar la fecha de hoy
      const finalDate = endDate || new Date();
      
      // Asegurar que initialDate sea el inicio del día
      const startOfDay = new Date(initialDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      // Asegurar que finalDate sea el fin del día
      const endOfDay = new Date(finalDate);
      endOfDay.setHours(23, 59, 59, 999);

      return await this.calendarRecipeRepository.find({
        where: {
          date: Between(startOfDay, endOfDay),
        },
        relations: ['recipe', 'user'],
      });
    } catch (error) {
      console.error('Error en CalendarRecipeService.findByRangeDate:', error);
      throw error;
    }
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

