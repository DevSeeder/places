import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export abstract class AbstractGuard extends AuthGuard('jwt') {
  getAuthToken(context: Partial<ExecutionContext>, authType: string) {
    const request = context.switchToHttp().getRequest();

    if (!Object.keys(request.headers).includes('authorization'))
      throw new UnauthorizedException('No Authentication Provided');

    if (request.headers.authorization.split(' ')[0] !== `${authType}`)
      throw new UnauthorizedException(
        `Wrong Authentication Type. ${authType} Authentication is required`
      );

    return request.headers.authorization;
  }
}
