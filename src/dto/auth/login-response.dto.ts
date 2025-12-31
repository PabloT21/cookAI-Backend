import { User } from '../../entities/user.entity';

export class LoginResponseDto {
  user: User;
  token: string;
}

