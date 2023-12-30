import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const externalApiUrl = this.configService.get<string>('USER_MICRO_API');

    try {
      const response = await this.httpService
        .post(externalApiUrl, createUserDto)
        .toPromise();
      return response.data;
    } catch (error) {
      throw new Error(`Failed to post to external API: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
