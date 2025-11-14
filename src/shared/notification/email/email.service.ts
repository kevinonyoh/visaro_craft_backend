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

    async AgentSignUp(data: {email: string}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: '🎉 Welcome to Visaro Craft!',
        template: './layouts/partnerWelcomeEmail',
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

    async agentReferral(data: {email: string, firstName: string, fullName: string, userEmail: string}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Someone just registered using your VisaroCraft referral link.',
        template: './layouts/partnerReferral',
        context: {
          ...data,
          main: 'Great news! 🎉', 
         title: 'Lead Details',   
        subtitle: `Someone just registered using your VisaroCraft referral link.`, 
        text: 'Check your dashboard for details',
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

    async finalPayment(data: {email: string, firstName: string}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Your Final Payment Is Confirmed – Petition Moving to Conclusion Phase',
        template: './layouts/finalPayment',
        context: {
          ...data,
          title: 'Your Petition Has Entered the Final Completion & Submission Phase',
          main: 'Payment Confirmed 🎉',
          subtitle:
            'Congratulations! Your Petition Is Entering the Final Submission Process',
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

    async weekOneCompleted(data: {email: string, firstName: string, weekNumber: number}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: `Congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
        template: './layouts/weekOneCompleted',
        context: {
          ...data,
          title: `congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
          main: 'Week one success!',
          subtitle: 'Milestone one accomplished!',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:happyGirl',
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
            cid: 'happyGirl',
          },
        ],
      }); 
    }

    async weekTwoCompleted(data: {email: string, firstName: string, weekNumber: number}){

      await this.mailerService.sendMail({
        to: data.email,
        subject: `Congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
        template: './layouts/weekTwoCompleted',
        context: {
          ...data,
          title: `congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
          main: 'Week two success!',
          subtitle:  'Another milestone accomplished!',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:happyGirl',
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
            cid: 'happyGirl',
          },
        ],
      }); 

    }

    async weekThreeCompleted(data: {email: string, firstName: string, weekNumber: number}){
      await this.mailerService.sendMail({
        to: data.email,
        subject: `Congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
        template: './layouts/weekThreeCompleted',
        context: {
          ...data,
          title: `congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
          main: 'Week three success!',
          subtitle: 'Another milestone accomplished!',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:happyGirl',
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
            cid: 'happyGirl',
          },
        ],
      }); 
    }

    async weekFourCompleted(data: {email: string, firstName: string, weekNumber: number}){
      
      await this.mailerService.sendMail({
        to: data.email,
        subject: `Congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
        template: './layouts/weekFourCompleted',
        context: {
          ...data,
          title: `congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
          main: 'Week four success!',
          subtitle: 'Another milestone accomplished!',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:happyGirl',
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
            cid: 'happyGirl',
          },
        ],
      }); 

    }


    async weekFourSecondMail(data: {email: string, firstName: string}){
      
      await this.mailerService.sendMail({
        to: data.email,
        subject: `Complete Your Last Payment to Finalize Your Petition`,
        template: './layouts/weekFourSecondMail',
        context: {
          ...data,
          title: `Your Last Payment to Finalize Your Petition`,
          main: 'You are almost there!',
          subtitle: 'Another milestone accomplished!',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:happyGirl',
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
            cid: 'happyGirl',
          },
        ],
      }); 

    }

    
    async weekFiveCompleted(data: {email: string, firstName: string, weekNumber: number}){

      await this.mailerService.sendMail({
        to: data.email,
        subject: `Congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
        template: './layouts/weekFiveCompleted',
        context: {
          ...data,
          title: `congratulations! Week ${data.weekNumber} of Your EB-1A Petition Is Now Complete`,
          main: 'Week five success!',
          subtitle: 'Another milestone accomplished!',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:happyGirl',
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
            cid: 'happyGirl',
          },
        ],
      }); 

    }
    

    async emailVerification( data: { email: string, firstName: string, code: string; }) {

      await this.mailerService.sendMail({
        to: data.email,
        subject: `Your OTP for Email Verification`,
        template: './layouts/otp-code',
        context: {
          ...data,
          title: `Your OTP for Email Verification`,
          main: 'Verify Your Email',
          subtitle: 'Confirm Your Email',
          text: 'View Next Steps',
          logoUrl: 'cid:logoImage',
          imageUrl: 'cid:happyGirl',
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
            cid: 'happyGirl',
          },
        ],
      });

    
    }


}
