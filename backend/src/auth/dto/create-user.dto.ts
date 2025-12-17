import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(3)
  password: string;

  // Optional: role can be added if you want to allow ADMIN creation
  @IsEnum(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';
}
