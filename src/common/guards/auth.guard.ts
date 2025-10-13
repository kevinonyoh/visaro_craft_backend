import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { IS_LOGIN_KEY } from '../decorators/login.decorator';
import { IS_ADMIN_KEY } from '../decorators/is-admin.decorator';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, 
    private reflector: Reflector,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [context.getHandler(), context.getClass()]);

    const isLogin = this.reflector.getAllAndOverride<boolean>(IS_LOGIN_KEY, [context.getHandler(), context.getClass()]);
    


    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    if (isLogin) return await this.validateAnyLogin(request);

    if (isAdmin) return await this.validateAdmin(request);

    const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('Valid token is required');

  
    const _token = token.replace(/(Bearer\s|bearer\s)/, '');
    
   
    const privateKey =this.configService.get<string>('secretKey');
     
    try {
      const decoded = await this.jwtService.verifyAsync(_token, { secret: privateKey });
   
      request.user = decoded;
      
    } catch (err) {
      if (/Token/.test(err.name)) throw new UnauthorizedException('Invalid token');
      
      throw err;
    }

    return true;
  }

  private async validateAdmin(request) {
    const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('Valid token is required');

    const _token = token.replace(/(Bearer\s|bearer\s)/, '');
    
    const secret = this.configService.get<string>('adminSecretKey');
     
    try {
      const decoded = await this.jwtService.verifyAsync(_token, { secret });
 
      request.admin = decoded;
    } catch (err) {
      if (/Token/.test(err.name)) throw new UnauthorizedException('Invalid token');
      
      throw err;
    }

    return true;
  }


  private async validateAnyLogin(request) {
    const token = request.headers['authorization'];
    if (!token) throw new UnauthorizedException('Valid token is required');
  
    const _token = token.replace(/(Bearer\s|bearer\s)/, '');
  
    const userSecret = this.configService.get<string>('secretKey');
    const adminSecret = this.configService.get<string>('adminSecretKey');
  
    try {
      const decodedUser = await this.jwtService.verifyAsync(_token, { secret: userSecret });
      request.user = decodedUser;
      return true;
    } catch (userErr) {
      try {
        const decodedAdmin = await this.jwtService.verifyAsync(_token, { secret: adminSecret });
        request.admin = decodedAdmin;
        return true;
      } catch (adminErr) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  
}
