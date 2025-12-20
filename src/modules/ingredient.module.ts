import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientController } from '../controllers/ingredient.controller';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../entities/ingredient.entity';
import {
  ResponseHandlerService,
  RESPONSE_HANDLER_CONFIG,
} from '../services/response-handler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientController],
  providers: [
    IngredientService,
    {
      provide: RESPONSE_HANDLER_CONFIG,
      useValue: {
        entityName: 'ingredient',
      },
    },
    ResponseHandlerService,
  ],
  exports: [IngredientService],
})
export class IngredientModule {}

