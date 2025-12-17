import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { CurrentUser } from './current-user.decorator';
import { Role, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './roles.decorator';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { name: string; password: string }) {
    const user = await this.authService.validateUser(body.name, body.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Roles(Role.ADMIN)
@Get('users')
async getAllUsers() {
  return this.authService.getAllUsers();
}

@Roles(Role.ADMIN)
@Patch('users/:id/role')
async updateUserRole(
  @Param('id') id: string,
  @Body() body: { role: Role }
) {
  return this.authService.updateUserRole(id, body.role);
}
@Roles(Role.ADMIN)
@Delete('users/:id')
async deleteUser(@Param('id') id: string) {
  return this.authService.deleteUser(id);
}
}
