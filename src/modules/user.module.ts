import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Ingredient } from 'src/entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ingredient])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}