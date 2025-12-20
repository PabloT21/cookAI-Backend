import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { ResponseHandlerService } from './response-handler.service';
import { Recipe } from 'src/entities/recipe.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    private responseHandler: ResponseHandlerService,
  ) {}

  findAll(): Promise<Ingredient[]> {
    return this.ingredientRepository.find({
      relations: ['categories', 'recipes', 'recipes.recipe'],
    });
  }

  findOne(id: string): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({
      where: { id },
      relations: ['categories', 'recipes', 'recipes.recipe'],
    });
  }

  create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const ingredient = this.ingredientRepository.create({
      name: createIngredientDto.name,
    });
    return this.ingredientRepository.save(ingredient);
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient | null> {
    await this.ingredientRepository.update(id, updateIngredientDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.ingredientRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
