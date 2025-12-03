import { Injectable } from '@nestjs/common';
import { Ingredient } from '../entities/ingredient.entity';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

@Injectable()
export class IngredientService {
  private ingredients: Ingredient[] = [];
  private idCounter = 1;

  findAll(): Ingredient[] {
    return this.ingredients;
  }

  findOne(id: string): Ingredient | undefined {
    return this.ingredients.find(ingredient => ingredient.id === id);
  }

  create(createIngredientDto: CreateIngredientDto): Ingredient {
    const ingredient: Ingredient = {
      id: this.idCounter.toString(),
      name: createIngredientDto.name,
      available: createIngredientDto.available,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.idCounter++;
    this.ingredients.push(ingredient);
    return ingredient;
  }

  update(id: string, updateIngredientDto: UpdateIngredientDto): Ingredient | null {
    const ingredient = this.findOne(id);
    if (!ingredient) {
      return null;
    }

    if (updateIngredientDto.name !== undefined) {
      ingredient.name = updateIngredientDto.name;
    }
    if (updateIngredientDto.available !== undefined) {
      ingredient.available = updateIngredientDto.available;
    }
    ingredient.updatedAt = new Date();

    return ingredient;
  }

  remove(id: string): boolean {
    const index = this.ingredients.findIndex(ingredient => ingredient.id === id);
    if (index === -1) {
      return false;
    }
    this.ingredients.splice(index, 1);
    return true;
  }

  toggleAvailability(id: string): Ingredient | null {
    const ingredient = this.findOne(id);
    if (!ingredient) {
      return null;
    }
    ingredient.available = !ingredient.available;
    ingredient.updatedAt = new Date();
    return ingredient;
  }
}

