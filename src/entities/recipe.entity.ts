import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { Ingredient } from './ingredient.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryColumn({ type: 'char', length: 36 })
  @Generated('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column('json')
  keys: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes)
    ingredients: Ingredient[];
  
}

