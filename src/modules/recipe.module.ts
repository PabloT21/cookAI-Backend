import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeController } from '../controllers/recipe.controller';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { Ingredient } from '../entities/ingredient.entity';
import { User } from '../entities/user.entity';
import {
  ResponseHandlerService,
  RESPONSE_HANDLER_CONFIG,
} from '../services/response-handler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, RecipeIngredient, Ingredient, User]),
  ],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    {
      provide: RESPONSE_HANDLER_CONFIG,
      useValue: {
        entityName: 'recipe',
      },
    },
    ResponseHandlerService,
  ],
  exports: [RecipeService],
})
export class RecipeModule {}


