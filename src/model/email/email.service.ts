import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService) { }

    async sendPasswordResetCode(email: string, reset_code: string) {

        await this.mailerService.sendMail({
            to: email,
            from: process.env.MAIL_USER,
            subject: 'Clothey Password Reset',
            template: './confirmation',
            context: {
                reset_code: reset_code
            },
        });
    }
}
