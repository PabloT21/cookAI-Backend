import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,

} from 'typeorm';
import { Ingredient } from './ingredient.entity';

import { Recipe } from './recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryColumn({type: 'char', length: 36})
  id: number;

  @Column()
  quantity: number;

  //tal vez convendría esto en la tabla del ingrediente, es raro que cambie la unidad de medida de una receta a otra
  @Column()
    unit: string;
  @ManyToOne(() => Recipe, recipe => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, ingredient => ingredient.recipes, {
    onDelete: 'CASCADE',
  })
  ingredient: Ingredient;
}


