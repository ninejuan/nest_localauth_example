// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { LocalStrategy } from '../common/strategy/local.strategy';
import { config } from 'dotenv';import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
 config();

const env = process.env;

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtModule.register({
    secret: env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),]
})
export class AuthModule {}
