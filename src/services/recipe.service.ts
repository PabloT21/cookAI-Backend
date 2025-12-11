import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from 'src/entities/recipe-ingredient.entity';
import { Ingredient } from 'src/entities/ingredient.entity';


@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>, 
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
  ) {}

  findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      relations: ['ingredients', 'ingredients.ingredient', 'tags'],
    });
  }

  findOne(id: string): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients', 'ingredients.ingredient', 'tags'],
    });
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe | null> {
     const recipe = this.recipeRepository.create({
      name: createRecipeDto.name,
    });
    await this.recipeRepository.save(recipe);
    const relations: RecipeIngredient[] = []

      for (const item of createRecipeDto.ingredients) {
      const ingredient = await this.ingredientRepo.findOne({
        where: { id: item.id },
      });

      if (!ingredient)
        throw new NotFoundException(`El ingrediente no es valido`);

      const ri = this.recipeIngredientRepository.create({ 
        recipe,
        ingredient,
        quantity: item.quantity,
      });

      
    await this.recipeIngredientRepository.save(relations);

      relations.push(ri);
    }

    
    
  return this.recipeRepository.findOne({
      where: { id: recipe.id },
      relations: ['ingredients', 'ingredients.ingredient'],
    });
}

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe | null> {
    await this.recipeRepository.update(id, updateRecipeDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.recipeRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async addIngredient(recipeId: string, ingredientId: string,quantity:number, unit:string): Promise<Recipe| null> {
    const recipe = await this.findOne(recipeId);
    const ingredient = await this.ingredientRepo.findOne({ where: { id: ingredientId } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }
    const recipeIngredient = this.recipeIngredientRepository.create({
      recipe: recipe,
      ingredient: ingredient,
      quantity: quantity,
      unit: unit
    });
    await this.recipeIngredientRepository.save(recipeIngredient);
    return recipe;
}
}
