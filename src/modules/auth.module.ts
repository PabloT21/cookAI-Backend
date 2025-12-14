// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '../services/Auth.service';
// import { AuthController } from './Auth.controller';
import { JwtStrategy } from '../helpers/jwt.strategy';
import { AuthController } from '../controllers/auth.controller';
import { UsersModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: 1440}, // 1 día por defecto
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  controllers: [
    AuthController,
  ],
})
export class AuthModule {}
