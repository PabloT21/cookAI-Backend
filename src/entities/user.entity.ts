import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.id)
    ingredients: Ingredient[];
  
  @OneToMany(() => Recipe, (recipe) => recipe.user)
    createdRecipes: Recipe[];

  @ManyToMany(() => Recipe, (recipe) => recipe.favoritedBy)
    favoriteRecipes: Recipe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

