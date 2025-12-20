import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientCategory } from '../entities/ingredientCategory.entity';
import { CreateIngredientCategoryDto } from '../dto/ingredient-categories/create-ingredient-category.dto';
import { UpdateIngredientCategoryDto } from '../dto/ingredient-categories/update-ingredient-category.dto';
import { ResponseHandlerService } from './response-handler.service';

@Injectable()
export class IngredientCategoryService {
  constructor(
    @InjectRepository(IngredientCategory)
    private categoryRepository: Repository<IngredientCategory>,
    private responseHandler: ResponseHandlerService,
  ) {}

  findAll(): Promise<IngredientCategory[]> {
    return this.categoryRepository.find({
      relations: ['ingredients'],
    });
  }

  findOne(id: string): Promise<IngredientCategory | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['ingredients'],
    });
  }

  create(
    createCategoryDto: CreateIngredientCategoryDto,
  ): Promise<IngredientCategory> {
    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });
    return this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateIngredientCategoryDto,
  ): Promise<IngredientCategory | null> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

