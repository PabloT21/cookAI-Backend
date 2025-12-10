import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { Ingredient } from './ingredient.entity';
import { RecipeTag } from './recipeTag.entity';
import {User} from "./user.entity";

@Entity('recipes')
export class Recipe {
  @PrimaryColumn({ type: 'char', length: 36 })
  @Generated('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  instructions: string;
  
  @Column('json')
  keys: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
    user: User;
  
  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes)
    ingredients: Ingredient[];

  @ManyToMany(() => RecipeTag, (tag) => tag.recipes)
    tags: RecipeTag[];

}

