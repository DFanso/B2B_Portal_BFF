import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CognitoService } from './CognitoService';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cognitoService: CognitoService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const userId = await this.cognitoService.registerUser(
        createUserDto.email,
        createUserDto.password,
      );
      createUserDto.userId = userId;

      return this.authService.create(createUserDto);
    } catch (err) {
      throw new Error(`Registration failed: ${err.message}`);
    }
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const token = await this.cognitoService.authenticateUser(
      createUserDto.email,
      createUserDto.password,
    );
    return { message: 'User login successfully', token };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('jwt')
  testJwt() {
    return this.authService.findAll();
  }
}
