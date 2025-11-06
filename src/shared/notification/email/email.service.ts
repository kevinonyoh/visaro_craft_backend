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


    async qualificationApproved(data: {email: string, firstName: string}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: '🎉 EB-1A Consultation Qualification Successful!',
        template: './layouts/qualification-approved',
        context: {
          ...data,
          title: 'EB-1A Consultation Qualification Successful!',
          main: 'Congratulations, You Passed the EB-1A Consultation Stage 🎉',
          subtitle:
            'Your journey toward EB-1A approval officially begins — we’re excited to start building your petition strategy.',
          text: 'Access Your Client Portal',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:celebrationImage',
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


    async disQualification(data: {email: string, firstName: string}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'EB-1A Consultation Result – Profile Strengthening Recommended',
        template: './layouts/qualification-not-approved',
        context: {
          ...data,
          title: 'EB-1A Consultation Result',
          main: 'Profile Strengthening Recommended',
          subtitle:
            'Your consultation review indicates further development is required before proceeding with your EB-1A petition.',
          text: 'View Recommendations',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:consultationImage',
        },
        attachments: [
          {
            filename: 'logo.png',
            path: 'src/shared/notification/email/templates/images/logo.png',
            cid: 'logoImage',
          },
          {
            filename: 'consultation.png',
            path: 'src/shared/notification/email/templates/images/celerabate.png',
            cid: 'consultationImage',
          },
        ],
      });
      
    }


    async paymentConfirmation(data: {email: string, firstName: string}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Payment Confirmed – Your EB-1A Petition Process Has Begun',
        template: './layouts/payment-confirmation',
        context: {
          ...data,
          title: 'EB-1A Petition Activated',
          main: 'Payment Confirmed 🎉',
          subtitle:
            'Your EB-1A petition preparation process is now officially activated. We’re ready to begin building your success story.',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:paymentImage',
        },
        attachments: [
          {
            filename: 'logo.png',
            path: 'src/shared/notification/email/templates/images/logo.png',
            cid: 'logoImage',
          },
          {
            filename: 'payment.png',
            path: 'src/shared/notification/email/templates/images/celerabate.png',
            cid: 'paymentImage',
          },
        ],
      });
      
    }






    
}