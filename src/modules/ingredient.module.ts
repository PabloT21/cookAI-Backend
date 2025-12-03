import { Module } from '@nestjs/common';
import { IngredientController } from '../controllers/ingredient.controller';
import { IngredientService } from '../services/ingredient.service';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [IngredientService],
})
export class IngredientModule {}

