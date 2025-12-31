import { Post, Body } from "@nestjs/common";
import { AuthService } from "src/services/Auth.service";
import { Controller } from "@nestjs/common";
import { ResponseHandlerService } from '../services/response-handler.service';
import { LoginDto } from '../dto/auth/login.dto';

@Controller('auth')
export class AuthController{   
    constructor(private readonly authService: AuthService){}
    @Post('login')
    login(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto.email, loginDto.password)

    }
}