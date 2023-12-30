import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { ClsModule } from "nestjs-cls";
import { CognitoService } from "./CognitoService";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), ConfigModule,ClsModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CognitoService],
})
export class AuthModule {}
