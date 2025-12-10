import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { Recipe } from '../entities/recipe.entity';


@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      relations: ['ingredients', 'tags'],
    });
  }

  findOne(id: string): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients', 'tags'],
    });
  }

  create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const ingredient = this.recipeRepository.create({
      name: createRecipeDto.name,
      description: createRecipeDto.description,
      instructions: createRecipeDto.instructions,
      
    });
    return this.recipeRepository.save(ingredient);
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe | null> {
    await this.recipeRepository.update(id, updateRecipeDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.recipeRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
