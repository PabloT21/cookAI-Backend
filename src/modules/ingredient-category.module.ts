import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientCategoryController } from '../controllers/ingredient-category.controller';
import { IngredientCategoryService } from '../services/ingredient-category.service';
import { IngredientCategory } from '../entities/ingredientCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientCategory])],
  controllers: [IngredientCategoryController],
  providers: [IngredientCategoryService],
  exports: [IngredientCategoryService],
})
export class IngredientCategoryModule {}


