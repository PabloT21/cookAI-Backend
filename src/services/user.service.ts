import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { Recipe } from 'src/entities/recipe.entity';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import * as argon2 from 'argon2';
import { ResponseHandlerService } from './response-handler.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Ingredient)
    private recipeRepository: Repository<Recipe>,
    private responseHandler: ResponseHandlerService,
  ) {}

    findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['ingredients', 'createdRecipes', 'favoriteRecipes'], // agregar calendarEvent cuando se cree
    });
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['ingredients', 'createdRecipes', 'favoriteRecipes'], // agregar calendarEvent cuando se cree
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User | null> {
     const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });
    await this.userRepository.save(user);
    return user;
  }

  //async update(id: string, updateUserDto: CreateUserDto): Promise<User | null> {
    //const user = await this.userRepository.findOne({ where: { id } });
    //if (!user) {
    //throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    //}

  async remove(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id) || 0;
    return (result.affected ?? 0) > 0;
  }

  async getUserIngredients(userId: string): Promise<Ingredient[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ingredients'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return user.ingredients || [];
  }

  async updateAvailableIngredients(
    userId: string,
    ingredientIds: string[],
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ingredients'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const ingredients = await this.ingredientRepository.find({
      where: { id: In(ingredientIds) },
    });

    user.ingredients = ingredients;
    return await this.userRepository.save(user);
  }
}