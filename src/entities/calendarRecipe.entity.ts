import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  ManyToOne
} from 'typeorm';
import { Recipe} from './recipe.entity';
import { User } from './user.entity';


@Entity('calendar_recipes')
export class CalendarRecipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column()
  date: Date; //Incluye la hora

  @ManyToOne(() => Recipe, (recipe) => recipe.calendarApparences)
  recipe: Recipe;

  @ManyToOne(() => User, (user) => user.calendarRecipes)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

