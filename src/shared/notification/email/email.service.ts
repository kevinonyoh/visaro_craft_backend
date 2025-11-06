import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async adminCreated(data: {email: string; password: string, role: string}) {
        await this.mailerService.sendMail({
          to: data.email,
          subject: 'Welcome to SGT',
          template: 'admin-created',
          context: {
            ...data
          }
        });
      }

    // async signUp(data: {email: string, firstName: string}){
    //   await this.mailerService.sendMail({
    //     to: data.email,
    //     subject: '🎉 Welcome to visaro craft!',
    //     template: './sign-up',
    //     context: {
    //       ...data
    //     }
    //   })
    // }

    async verificationOtp(data: {email: string, fullName: string, code: string}){
        await this.mailerService.sendMail({
          to: data.email,
          subject: 'SGT - Your OTP Code',
        template: 'verification',
        context: {
          ...data
        }
        })
    }

    async forgotPassword( data: { email: string, firstName: string, code: string; }) {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Forgot Password',
        template: './forgot-password',
        context: {
          ...data
        }
      });
    }


    async signUp(data: {email: string, firstName: string}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: '🎉 Welcome to Visaro Craft!',
        template: './layouts/welcome',
        context: {
          ...data,
          title: 'Welcome to Visaro Craft!',
          main: 'Welcome Aboard 🎉',
          subtitle: 'Your account has been created successfully.',
          text: "Let's Get Started",
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:celebrationImage'
        },
        attachments: [
          {
            filename: 'logo.png',
            path: 'src/shared/notification/email/templates/images/logo.png',
            cid: 'logoImage',
          },
          {
            filename: 'celebration.png',
            path: 'src/shared/notification/email/templates/images/celerabate.png',
            cid: 'celebrationImage',
          },
        ],
      });
      
    }
    
}