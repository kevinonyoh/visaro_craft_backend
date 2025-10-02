import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as helpers from "src/common/utils/helper";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
 
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.userService.getUserByEmail(email);

    if (!user || user['deletedAt']) throw new UnauthorizedException('Invalid login credentials'); 

    // if (!user.isActivated && user.isEmailVerified) throw new ForbiddenException('Account deactivated');

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) throw new UnauthorizedException('Invalid login credentials');

    const accessToken = await helpers.getAccessToken(user, this.jwtService, () => this.configService.get<'string'>('secretKey'));
  
    return {
      ...user.toJSON(),
      accessToken
    };
  }

}
