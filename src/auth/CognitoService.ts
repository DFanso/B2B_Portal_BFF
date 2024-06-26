import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailDto } from './dto/verfiy-email.dto';

@Injectable()
export class CognitoService {
  private client: CognitoIdentityProviderClient;
  private clientId: string;
  private clientSecret: string;
  private userPoolId: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
    this.userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');
    this.clientSecret = this.configService.get<string>('COGNITO_CLIENT_SECRET');
    this.client = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: fromEnv(),
    });
  }

  private generateSecretHash(email: string): string {
    return crypto
      .createHmac('SHA256', this.clientSecret)
      .update(email + this.clientId)
      .digest('base64');
  }

  async registerUser(email: string, password: string): Promise<any> {
    const secretHash = this.generateSecretHash(email);
    const params = {
      ClientId: this.clientId,
      Username: email,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    try {
      const data = await this.client.send(new SignUpCommand(params));
      console.log('Registration successful:', data);
      return data.UserSub;
    } catch (err) {
      console.error('Error during registration:', err);
      if (err.name === 'UsernameExistsException') {
        throw new HttpException(
          `An account with the given email already exists.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Registration failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async authenticateUser(email: string, password: string): Promise<any> {
    const secretHash = this.generateSecretHash(email);
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH' as any,
      ClientId: this.clientId,
      SecretHash: secretHash,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    try {
      const data = await this.client.send(new InitiateAuthCommand(params));
      console.log('Authentication successful:', data);
      return data.AuthenticationResult.IdToken;
    } catch (err) {
      console.error('Error during authentication:', err);
      if (err.name === 'NotAuthorizedException') {
        throw new HttpException(
          `Incorrect username or password.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (err.name === 'UserNotConfirmedException') {
        throw new HttpException(
          `User is not Verified.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Registration failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<any> {
    const secretHash = this.generateSecretHash(verifyEmailDto.email);
    const params = {
      ClientId: this.clientId,
      Username: verifyEmailDto.email,
      SecretHash: secretHash,
      ConfirmationCode: verifyEmailDto.confirmationCode,
    };

    try {
      const data = await this.client.send(new ConfirmSignUpCommand(params));
      console.log('Email verification successful:', data);
      return data;
    } catch (err) {
      console.error('Error during email verification:', err);
      if (err.name === 'CodeMismatchException') {
        throw new HttpException(
          `Invalid verification code provided, please try again.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (err.name === 'ExpiredCodeException') {
        throw new HttpException(
          `Invalid verification code provided, please try again.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
