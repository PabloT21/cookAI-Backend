import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { IngredientCategory } from './ingredientCategory.entity';

import { Recipe } from './recipe.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryColumn({ type: 'char', length: 36 })
  @Generated('uuid')
  id: string;

  @Column()
  name: string;

  @Column('json')
  keys: string[];

  

  @Column({ default: false })
  available: boolean;

  @ManyToMany(() => IngredientCategory, (category) => category.ingredients)
  categories: IngredientCategory[];

  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
  recipes: Recipe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

