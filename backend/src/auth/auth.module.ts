import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';
import { JwtAuthGuard } from './jwt.guard.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'FarmaSecret_SuperSeguro_2026',
      signOptions: { expiresIn: '8h' }, // Un turno laboral completo
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}