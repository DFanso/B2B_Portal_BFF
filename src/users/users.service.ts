import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const USER_MICRO_API = this.configService.get<string>('USER_MICRO_API');

    try {
      const user = await this.httpService
        .post(USER_MICRO_API, createUserDto)
        .toPromise();
      const userResponse: UserResponseDto = {
        userId: user.data.userId,
        name: user.data.name,
        email: user.data.email,
        type: user.data.type,
      };

      return userResponse;
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const USER_MICRO_API = this.configService.get<string>('USER_MICRO_API');

    try {
      const user = await this.httpService
        .get(`${USER_MICRO_API}/${id}`)
        .toPromise();
      if (!user) {
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
      }
      const userResponse: UserResponseDto = {
        userId: user.data.userId,
        name: user.data.name,
        email: user.data.email,
        type: user.data.type,
      };

      return userResponse;
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
