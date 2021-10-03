import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { resolveSoa } from 'dns';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { AUTH_HEADER } from '../constants/headers.const';
import { Roles } from '../enums/role.enum';

@Injectable()
export class JwtAdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    let token = null;

    try {
      token = request.headers[AUTH_HEADER].replace('Bearer ', '');
    } catch(err) {
      throw new UnauthorizedException();
    }
    let jwtPayload = null;

    try {
      jwtPayload = await this.userService.verify(token);
      let isAdmin: boolean = jwtPayload.role == Roles.ROLE_ADMIN ? true : false;

      return isAdmin;
    } catch(err) {
      throw new UnauthorizedException();
    }
  }
  
}
