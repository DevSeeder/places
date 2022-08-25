import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../domain/jwt/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [],
  providers: [JwtStrategy, JwtService],
  exports: [JwtStrategy, JwtService]
})
export class AuthModule {}
