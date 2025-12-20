import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientCategoryController } from '../controllers/ingredient-category.controller';
import { IngredientCategoryService } from '../services/ingredient-category.service';
import { IngredientCategory } from '../entities/ingredientCategory.entity';
import {
  ResponseHandlerService,
  RESPONSE_HANDLER_CONFIG,
} from '../services/response-handler.service';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientCategory])],
  controllers: [IngredientCategoryController],
  providers: [
    IngredientCategoryService,
    {
      provide: RESPONSE_HANDLER_CONFIG,
      useValue: {
        entityName: 'ingredient-category',
      },
    },
    ResponseHandlerService,
  ],
  exports: [IngredientCategoryService],
})
export class IngredientCategoryModule {}




