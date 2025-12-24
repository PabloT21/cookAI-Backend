import { Post, Body } from "@nestjs/common";
import { AuthService } from "src/services/Auth.service";
import { Controller } from "@nestjs/common";
import { ResponseHandlerService } from '../services/response-handler.service';

@Controller('auth')
export class AuthController{   
    constructor(private readonly authService: AuthService){}
    @Post('login')
    login(@Body() body: { email: string; password: string }){
    return this.authService.login(body.email, body.password)

    }
}