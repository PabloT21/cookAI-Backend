import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarRecipeController } from '../controllers/calendar-recipe.controller';
import { CalendarRecipeService } from '../services/calendar-recipe.service';
import { CalendarRecipe } from '../entities/calendarRecipe.entity';
import {
  ResponseHandlerService,
  RESPONSE_HANDLER_CONFIG,
} from '../services/response-handler.service';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarRecipe])],
  controllers: [CalendarRecipeController],
  providers: [
    CalendarRecipeService,
    {
      provide: RESPONSE_HANDLER_CONFIG,
      useValue: {
        entityName: 'calendar-recipe',
      },
    },
    ResponseHandlerService,
  ],
  exports: [CalendarRecipeService],
})
export class CalendarRecipeModule {}


