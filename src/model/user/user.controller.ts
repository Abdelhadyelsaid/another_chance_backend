import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { PutUpdateUserDto } from './dto/update_all_user_data.dto';
import { PatchUpdateUserDto } from './dto/update_user_data.dto';
import { UserSignInDto } from './dto/user_sign_in.dto';
import { UserSignUpDto } from './dto/user_sign_up.dto';
import { UserService } from './user.service';
import { SendResetCodeDto } from './dto/send_reset_code.dto';
import { ConfirmResetCodeDto } from './dto/confirm_reset_code.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post('signin')
    logIn(@Body() body: UserSignInDto) {
        return this.userService.signIn(body)
    }

    @Post('signup')
    signup(@Body() body: UserSignUpDto) {
        return this.userService.signUp(body)
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Put('update')
    updateAllUserData(@Body() body: PutUpdateUserDto, @Request() req: any) {

        if(!body) {
            throw new HttpException("You did't provide a body", HttpStatus.BAD_REQUEST);
        }

        return this.userService.updateAllUserData(body, req.user_id)
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Patch('update')
    updateUserData(@Body() body: PatchUpdateUserDto, @Request() req: any) {

        if(!body) {
            throw new HttpException("You did't provide a body", HttpStatus.BAD_REQUEST);
        }

        return this.userService.updateUserData(body, req.user_id)
    }
    
    @UseGuards(RolesGuard([Role.ADMIN]))
    @Get('verify-token')
    verifyToken(@Query('token') token: string) {
        if (!token) {
            throw new HttpException("You Didn't Provide the token.", HttpStatus.BAD_REQUEST)
        }

        return this.userService.checkAuthorization(token)
    }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Post('make-admin')
    makeAdmin(@Query('user_id') id: number) {
        if (!id) {
            throw new HttpException("You Didn't Provide the user_id.", HttpStatus.BAD_REQUEST)
        }

        return this.userService.makeAdmin(id);
    }

    @Post('send-reset-code')
    sendResetCode(@Body() body: SendResetCodeDto) {
        return this.userService.sendResetCode(body);
    }

    @Post('confirm-reset-code')
    confirmResetCode(@Body() body: ConfirmResetCodeDto) {
        return this.userService.confirmResetCode(body);
    }

    @Patch('reset-password')
    resetPassword(@Body() body: ResetPasswordDto) {
        return this.userService.resetPassword(body);
    }

}