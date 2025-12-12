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

import { Ingredient } from './ingredient.entity';
import { RecipeTag } from './recipeTag.entity';
import {RecipeIngredient} from "./recipe-ingredient.entity";
import {User} from "./user.entity";

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  instructions: string;
  
  @Column('json')
  keys: string[];

  @Column({ nullable: true })
  time?: number;

  @Column({ nullable: true })
  difficulty?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdRecipes)
  @JoinTable()
    user: User;

  @ManyToMany(() => User, (user) => user.favoriteRecipes)
    favoritedBy: User[];
  
  @OneToMany(() => RecipeIngredient, (RI) => RI.recipe, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
    ingredients: RecipeIngredient[];

  @ManyToMany(() => RecipeTag, (tag) => tag.recipes)
  @JoinTable({
    name: 'recipe_recipe_tags',
    joinColumn: { name: 'recipe_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recipe_tag_id', referencedColumnName: 'id' },
  })
    tags: RecipeTag[];
  
}

