import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RecipeService } from '../services/recipe.service';
import { CreateRecipeDto } from '../dto/recipes/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipes/update-recipe.dto';
import { findByCriteriaRecipeDto } from 'src/dto/recipes/search-criteria-recipe.dto';
import { ResponseHandlerService } from '../services/response-handler.service';

@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Get()
  async findAll() {
    try {
      const recipes = await this.recipeService.findAll();
      return this.responseHandler.success(recipes);
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async findByCriteria(@Query() criteria: findByCriteriaRecipeDto, @Request() req: any) {
    try {
      const userId = req.user?.userId;
      const recipes = await this.recipeService.findByCriteria(criteria, userId);
      return this.responseHandler.success(recipes);
    } catch (error) {
      console.error('Error en findByCriteria:', error);
      throw error;
    }
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req: any) {
    try {
      const userId = req.user?.userId;
      const recipes = await this.recipeService.getFavoriteRecipes(userId);
      return this.responseHandler.success(recipes);
    } catch (error) {
      console.error('Error en getFavorites:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const recipe = await this.recipeService.findOne(id);
    if (!recipe) {
      this.responseHandler.notFound('recipe');
    }
    return this.responseHandler.success(recipe);
  }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const recipe = await this.recipeService.create(createRecipeDto);
    if (!recipe) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.created(recipe);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    const recipe = await this.recipeService.update(id, updateRecipeDto);
    if (!recipe) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.updated(recipe);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.recipeService.remove(id);
    if (!deleted) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.deleted();
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(@Param('id') id: string, @Request() req: any) {
    try {
      const userId = req.user?.userId;
      const recipe = await this.recipeService.addToFavorites(userId, id);
      if (!recipe) {
        return this.responseHandler.notFound('recipe');
      }
      return this.responseHandler.success(recipe);
    } catch (error) {
      console.error('Error en addToFavorites:', error);
      throw error;
    }
  }

  @Delete(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async removeFromFavorites(@Param('id') id: string, @Request() req: any) {
    try {
      const userId = req.user?.userId;
      const recipe = await this.recipeService.removeFromFavorites(userId, id);
      if (!recipe) {
        return this.responseHandler.notFound('recipe');
      }
      return this.responseHandler.success(recipe);
    } catch (error) {
      console.error('Error en removeFromFavorites:', error);
      throw error;
    }
  }
}

