import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from 'src/core/dto/user.dto';
import { JwtAdminGuard } from 'src/core/guards/jwt-admin.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('login')
    async login(@Req() req: any, @Body() body: UserLoginDto, @Res() resp: any): Promise<Response> {
        const token = await this.userService.login(body);
        return resp.status(HttpStatus.OK).json({token: token});
    }

    @Post('register')
    async register(@Req() req: any, @Body() body: UserRegisterDto, @Res() resp: any): Promise<Response> {
        try {
            const token = await this.userService.register(body);
            if(token === 'USER_EXISTS') {
                return resp.status(HttpStatus.USER_EXISTS).json({message: token});
            }
            return resp.status(HttpStatus.OK).json({token: token});
        } catch(err) {
            return resp.status(HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
    }

    @Delete(':id')
    @UseGuards(JwtAdminGuard)
    async deleteUser(@Req() req: any, @Param() id: number, @Res() resp: any): Promise<Response> {
        try {
            await this.userService.deleteUser(id);

            return resp.status(HttpStatus.OK);
        } catch(err) {
            throw err;
        }
    }
}
