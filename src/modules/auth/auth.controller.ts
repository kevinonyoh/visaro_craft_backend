import { Controller, Get, Post, Body, Patch, Param, Delete , HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ResponseMessage('Logged in successfully')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
}
