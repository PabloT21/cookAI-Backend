import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRecipeDto } from '../dto/recipes/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipes/update-recipe.dto';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from 'src/entities/recipe-ingredient.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { ResponseHandlerService } from './response-handler.service';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
    private responseHandler: ResponseHandlerService,
  ) {}

  async findAll(): Promise<Recipe[]> {
    try {
      const recipes = await this.recipeRepository.find({
        relations: ['ingredients', 'ingredients.ingredient', 'tags'],
      });
      return recipes || [];
    } catch (error) {
      console.error('Error en RecipeService.findAll:', error);
      throw error;
    }
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
      instructions: createRecipeDto.instructions,
      time: createRecipeDto.time,
      difficulty: createRecipeDto.difficulty,
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
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients'],
    });
    if (!recipe) throw new NotFoundException('Receta no encontrada');

    const ingredientIds = [...new Set(updateRecipeDto.ingredients.map((i) => i.id))];
    const dbIngredients = await this.ingredientRepo.findBy({ id: In(ingredientIds) });
    if (dbIngredients.length !== ingredientIds.length) {
      const dbIds = new Set(dbIngredients.map((i) => i.id));
      const missing = ingredientIds.filter((x) => !dbIds.has(x));
      throw new NotFoundException(`Ingredientes no válidos: ${missing.join(', ')}`);
    }

    const byId = new Map(dbIngredients.map((i) => [i.id, i]));

    // Campos simples
    recipe.name = updateRecipeDto.name;
    recipe.instructions = updateRecipeDto.instructions;
    recipe.time = updateRecipeDto.time;
    recipe.difficulty = updateRecipeDto.difficulty;

    // Reemplazo completo de la relación (cascade + orphanedRowAction se encargan)
    recipe.ingredients = updateRecipeDto.ingredients.map((item) =>
      this.recipeIngredientRepository.create({
        ...(item.recipeIngredientId ? { id: item.recipeIngredientId } : {}),
        quantity: item.quantity,
        unit: item.unit,
        ingredient: byId.get(item.id)!,
        recipe,
      }),
    );

    await this.recipeRepository.save(recipe);
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
