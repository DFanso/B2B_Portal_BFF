import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CognitoService } from './CognitoService';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verfiy-email.dto';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cognitoService: CognitoService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const userId = await this.cognitoService.registerUser(
        createUserDto.email,
        createUserDto.password,
      );
      createUserDto.userId = userId;
      console.log(createUserDto);
      const user = this.authService.create(createUserDto);

      return user;
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: 'User login successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    try {
      const token = await this.cognitoService.authenticateUser(
        userLoginDto.email,
        userLoginDto.password,
      );
      return { message: 'User login successfully', token };
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      console.log(verifyEmailDto);
      await this.cognitoService.verifyEmail(verifyEmailDto);
      return { statusCode: 200, message: 'Email verified successfully' };
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'User Profile' })
  @ApiResponse({ status: 200, description: 'JWT Token is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  testJwt() {
    return this.authService.profile();
  }
}
