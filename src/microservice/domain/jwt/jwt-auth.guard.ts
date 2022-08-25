import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { EnumScopes } from '../enumerators/enum-scopes.enum';
import { AbstractGuard } from './abstract-guard.guard';

dotenv.config();

@Injectable()
export class JwtAuthGuard extends AbstractGuard {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const bearerToken = this.getAuthToken(context, 'Bearer').replace(
        'Bearer ',
        ''
      );
      const tokenPayload = await this.jwtService.verifyAsync(bearerToken, {
        secret: this.configService.get<string>('jwt.secret'),
        ignoreExpiration: true
      });

      const scopes = this.reflector.get<string[]>(
        'scopes',
        context.getHandler()
      );

      if (!scopes || scopes.length === 0) return true;

      if (tokenPayload.scopes.indexOf(EnumScopes.ADM_PLACES) !== -1)
        return true;

      scopes.forEach((scope) => {
        if (tokenPayload.scopes.indexOf(scope) === -1) {
          throw new ForbiddenException('Missing Scope Authorization');
        }
      });

      return true;
    } catch (err) {
      throw new HttpException(
        `Error JWT Auth: ${err.message}`,
        err.status === HttpStatus.ACCEPTED
          ? HttpStatus.UNAUTHORIZED
          : err.status
      );
    }
  }
}
