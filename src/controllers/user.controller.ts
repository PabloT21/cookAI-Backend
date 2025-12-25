import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { UpdateUserIngredientsDto } from '../dto/users/update-user-ingredients.dto';
import { ResponseHandlerService } from '../services/response-handler.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return this.responseHandler.success(users);
  }

  @Get(':id/ingredients')
  async getUserIngredients(@Param('id') id: string) {
    const ingredients = await this.userService.getUserIngredients(id);
    return this.responseHandler.success(ingredients);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.success(user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    if (!user) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.created(user);
  }

  //@Put(':id')
  //update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
  // return this.userService.update(id, updateRecipeDto);
  // }

  @Put(':id/ingredients')
  async updateAvailableIngredients(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserIngredientsDto,
  ) {
    const user = await this.userService.updateAvailableIngredients(
      id,
      updateDto.ingredientIds,
    );
    return this.responseHandler.success(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.userService.remove(id);
    if (!deleted) {
      this.responseHandler.notFound();
    }
    return this.responseHandler.deleted();
  }
}