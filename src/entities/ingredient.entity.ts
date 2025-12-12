import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany
} from 'typeorm';
import { IngredientCategory } from './ingredientCategory.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { User } from './user.entity';


@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('json')
  keys: string[];

  @ManyToMany(() => IngredientCategory, (category) => category.ingredients)
  categories: IngredientCategory[];

  @OneToMany(() => RecipeIngredient, (RI) => RI.ingredient)
  recipes: RecipeIngredient[];

  @ManyToMany(() => User, (user) => user.ingredients)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

