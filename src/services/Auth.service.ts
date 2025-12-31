import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { Recipe } from 'src/entities/recipe.entity';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { LoginResponseDto } from 'src/dto/auth/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async login(email: string, password: string): Promise<LoginResponseDto | null> {  
    console.log(process.env.JWT_SECRET);
    console.log('JwtService options:', (this.jwtService as any).options);
    const user = await this.userRepository.findOne({ where: { email:email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    else {
        if (!await argon2.verify(user.password, password)) {
      throw new NotFoundException('Contraseña Incorrecta');
    }
    
    return {user: user || null,
            token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}




}