import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from 'src/Types/user.types';

export class CreateUserDto {
  userId: number;

  @ApiProperty({
    description: 'Name of the user',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'User password',
    type: String,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User email',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: UserType,
    description: 'Type of the user',
  })
  @IsEnum(UserType)
  type: UserType;
}
