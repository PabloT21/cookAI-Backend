import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import {
  ResponseHandlerService,
  RESPONSE_HANDLER_CONFIG,
} from '../services/response-handler.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ingredient])],
  controllers: [UsersController],
  providers: [
    UserService,
    {
      provide: RESPONSE_HANDLER_CONFIG,
      useValue: {
        entityName: 'user',
      },
    },
    ResponseHandlerService,
  ],
  exports: [UserService],
})
export class UsersModule {}