import {
  Controller,
  Get, Post, Put, Patch, Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from "../dto/create-user.dto";


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRecipeDto: CreateUserDto) {
    return this.userService.create(createRecipeDto);
  }

  //@Put(':id')
  //update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
  // return this.userService.update(id, updateRecipeDto);
  // }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const deleted = await this.userService.remove(id);
    if (!deleted) {
      return { message: 'Receta no encontrado' };
    }
    return null;
  }
}