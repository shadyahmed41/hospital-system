import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If a property is requested (e.g., @CurrentUser('id'))
    return data ? user?.[data] : user;
  },
);
