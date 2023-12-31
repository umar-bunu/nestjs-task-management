import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entities/user.entity';

/**Gets the current user */
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
