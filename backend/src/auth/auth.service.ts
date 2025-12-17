import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { name } });

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(pass, user.password);

    console.log(pass, user.password);
    

    if (!isMatch) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async login(user: any) {
    const payload = {
      name: user.name,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
       role: user.role, 
       name: user.name,
    };

    
  }

  async register(createUserDto: CreateUserDto) {
    const { name, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { name } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // Return created user (without password)
    const { password: _, ...result } = user;
    return result;
  }

  async getAllUsers() {
  const users = await this.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
  return users;
}

async updateUserRole(id: string, role: Role) {
  const user = await this.prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
  return user;
}

async deleteUser(id: string) {
  const user = await this.prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
  
  return { message: `User ${user.name} deleted successfully`, deletedUser: user };
}

}

