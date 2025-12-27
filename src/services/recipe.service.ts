import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from 'src/entities/recipe-ingredient.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { User } from 'src/entities/user.entity';
import { ResponseHandlerService } from './response-handler.service';
// Import de DTOs
import { CreateRecipeDto } from '../dto/recipes/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipes/update-recipe.dto';
import { findByCriteriaRecipeDto } from 'src/dto/recipes/search-criteria-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    async findByCriteria(criteria: findByCriteriaRecipeDto, userId?: string): Promise<Recipe[]> {
      try {
        const queryBuilder = this.recipeRepository
          .createQueryBuilder('recipe')
          .leftJoinAndSelect('recipe.ingredients', 'ingredients')
          .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
          .leftJoinAndSelect('recipe.tags', 'tags');

        // Filtro searchString: busca en nombre, instrucciones o nombre de ingrediente
        if (criteria.searchString) {
          const searchPattern = `%${criteria.searchString}%`;
          queryBuilder.andWhere(
            '(recipe.name LIKE :searchString OR recipe.instructions LIKE :searchString OR ingredient.name LIKE :searchString)',
            { searchString: searchPattern }
          );
        }

        // Filtro time: AND (menor o igual)
        if (criteria.time !== undefined) {
          queryBuilder.andWhere('recipe.time <= :time', { time: criteria.time });
        }

        // Filtro difficulty: AND (menor o igual)
        if (criteria.difficulty !== undefined) {
          queryBuilder.andWhere('recipe.difficulty <= :difficulty', { 
            difficulty: criteria.difficulty 
          });
        }

        queryBuilder.distinct(true);
        var recipes = await queryBuilder.getMany();

        if (criteria.ingredients !== undefined && criteria.ingredients.length > 0){
          recipes = await this.#filterByIngredients(criteria.ingredients, recipes)
        }

        if (criteria.onlyAvailable !== undefined && criteria.onlyAvailable == true && userId)
           recipes = await this.#orderByAvailableIngredients(recipes, userId); 

        return recipes || [];
      } catch (error) {
        console.error('Error en RecipeService.findByCriteria:', error);
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

  async #orderByAvailableIngredients(recipes: Recipe[], userId: string): Promise<Recipe[]> {
    // obtener los ingredientes del usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ingredients'],
    });
    //si no tiene ingredientes se devuelve el array vacio
    if (!user || !user.ingredients || user.ingredients.length === 0) {
      return [];
    }

    // Crear un Set con los IDs de ingredientes disponibles del usuario para búsqueda rápida
    const userIngredientIds = new Set(user.ingredients.map((ing) => ing.id));

    // mapea cada receta con la proporcion de ingredientes que tiene el usuario del total
    const recipesWithAvailability = recipes
      .map((recipe) => {
        const totalIngredients = recipe.ingredients.length;
        const availableIngredients = recipe.ingredients.filter((ri) =>
          userIngredientIds.has(ri.ingredient.id)
        ).length;

        const proportion = totalIngredients > 0 ? availableIngredients / totalIngredients : 0;

        return {
          recipe,
          proportion,
          availableIngredients,
          totalIngredients,
        };
      })
      .filter(({ proportion }) => proportion > 0) // Filtrar recetas que tengan al menos un ingrediente
      .sort((a, b) => {
        // Ordenar por proporción descendente (mayor proporción primero)
        // Si las proporciones son iguales, ordenar por número de ingredientes disponibles descendente
        if (b.proportion !== a.proportion) {
          return b.proportion - a.proportion;
        }
        return b.availableIngredients - a.availableIngredients;
      });

    // extrae la solo la receta del mapeo
    return recipesWithAvailability.map(({ recipe }) => recipe);
  }


  //helper del search que filtra por ingrediente
  async #filterByIngredients(requiredIngredientIds: string[], recipes: Recipe[]): Promise<Recipe[]> {

    const requiredSet = new Set(requiredIngredientIds);

    return recipes.filter((recipe) => {
      const recipeIngredientIds = new Set(
        (recipe.ingredients).map((ri) => ri.ingredient?.id)
      );
      // si alguno de los ingredientes no esta retorna falso y corta
      for (const id of requiredSet) {
        if (!recipeIngredientIds.has(id)) return false;
      }
      // si llega aca entonces estan todos y lo deja
      return true;
    });
  }
}
