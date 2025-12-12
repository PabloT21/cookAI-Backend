import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';

import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  
  @ManyToMany(() => Ingredient, (ingredient) => ingredient.users)
  @JoinTable()
    ingredients: Ingredient[];
  
  @OneToMany(() => Recipe, (recipe) => recipe.user)
    createdRecipes: Recipe[];

  @ManyToMany(() => Recipe, (recipe) => recipe.favoritedBy)
  @JoinTable()
    favoriteRecipes: Recipe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

