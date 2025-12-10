import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity('ingredient_categories')
export class IngredientCategory {
  @PrimaryColumn({ type: 'char', length: 36 })
  @Generated('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.categories)
  @JoinTable({
    name: 'ingredient_category_relation',
  })
  ingredients: Ingredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

