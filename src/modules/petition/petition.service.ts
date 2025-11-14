import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePetitionDto, DocumentsDto, MarkPetitionTimelineDto, QueryPetitionDto, UpdatePetitionStatusDto, UpdatePetitionTimelineDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { IUser } from '../users/interfaces/user.interface';
import { PetitionRepository } from './repositories/petition.repository';
import { Transaction } from 'sequelize';
import { PaymentService } from '../payment/payment.service';
import { DocumentRepository } from './repositories/document.repository';
import { IFindPayment, IPaymentType } from '../payment/interface/payment.interface';
import { PaymentModel } from '../payment/models/payment.model';
import { UsersModel } from '../users/models/users.model';
import { PetitionModel } from './model/petition.model';
import { IPetitionStatus, IPetitionTimeline } from './interface/petition.interface';
import { PetitionStageRepository } from './repositories/Petition-stage.repository';
import { PetitionStageModel } from './model/petition-stage.model';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { EmailService } from 'src/shared/notification/email/email.service';
import { INotification } from '../audit-trail/interface/notification.interface';


@Injectable()
export class PetitionService {

  constructor(
    private readonly petitonRepository: PetitionRepository,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly documentRepository: DocumentRepository,
    private readonly petitionStageRepository: PetitionStageRepository,
    private readonly auditTrailService: AuditTrailService,
    private readonly emailService: EmailService,

    ){}

  async createPetition(user: IUser,data: CreatePetitionDto, transaction: Transaction) {
    const userData = await this.petitonRepository.findOne({userId: user.id});

    if(userData) throw new BadRequestException("user cannot create more than one petition");

     const {petitionType} = data;

     const payload = {
      petitionType,
      userId: user.id
     }

     const petition = await this.petitonRepository.create(payload, transaction);

     const petitionJson = petition.toJSON();

     const stages = [...Object.values(IPetitionTimeline)]

     const petitionStages = stages.map((stage, index) => ({
      petitionId: petition.id,
      weekNumber: index + 1,
      stage,
      status: "PENDING",
    }));

    await this.petitionStageRepository.bulkCreate(petitionStages, transaction);

    const notification: INotification = {
        userId: user.id,
        recipientType: "USER",
        title: "petition created successfully",
        message: `your ${petitionType} petition was created successfully`
    }

    await this.auditTrailService.createNotification(notification, transaction);

    return {...petitionJson};
  }

  async updatePetitionStatus(id: string, data: UpdatePetitionStatusDto, transaction: Transaction){
    const {petitionStatus} = data;

    const statusData = await this.petitonRepository.update({id}, {petitionStatus}, transaction);

    const includeOption = {
      include: [
         {
           model: UsersModel,
           attributes: ['firstName', 'lastName', 'email', 'id']
         },
        
       ]
      }

    const user = await this.petitonRepository.findOne({id}, <unknown>includeOption);

    const notification: INotification = {
      userId: user["user"].id,
      recipientType: "USER",
      title: "Next phase after consultation",
      message: `your ${user["petitionType"]} petition was ${petitionStatus} after consultation`
  }

  await this.auditTrailService.createNotification(notification, transaction);


    if(petitionStatus === IPetitionStatus.APPROVED) await this.emailService.qualificationApproved({email: user["user"].email, firstName: user["user"].firstName})

    if(petitionStatus === IPetitionStatus.DECLINED) await this.emailService.disQualification({email: user["user"].email, firstName: user["user"].firstName});

    return statusData;
  }

  async findUserPetition(user: IUser){

    const includeOption = {
      include: [
         {
           model: UsersModel,
           attributes: ['firstName', 'lastName', 'email', 'id']
         },
         {
          model: PetitionStageModel
        },
        
       ]
      }

     return await this.petitonRepository.findOne({userId: user.id}, <unknown>includeOption);

  }

  async findPetition(id: string){

    const includeOption = {
      include: [
         {
           model: PaymentModel,
           where: { status: 'successful' }, 
           required: false
         },
         {
          model: UsersModel,
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: PetitionStageModel
        }
       ]
      }

    return await this.petitonRepository.findOne({id}, <unknown>includeOption);
 }


 async findAllPetition(data: QueryPetitionDto){

  const includeOption = {
    include: [
       {
         model: PaymentModel,
         where: { status: 'successful' }, 
         required: false
       },
       {
        model: UsersModel,
        attributes: ['id', 'firstName', 'lastName', 'email']
      },
      {
        model: PetitionStageModel
      }
     ]
    }

  return await this.petitonRepository.findAll({...data}, <unknown>includeOption);
}

async uploadDocument(user: IUser, data: DocumentsDto, transaction: Transaction){
  
    const petitionData = await this.petitonRepository.findOne({userId: user.id})

    if(!petitionData) throw new BadRequestException("you haven't create a petition yet");

    const petitionDataJson = petitionData.toJSON();


    const payload: IFindPayment = {
      userId: user.id,
      paymentOptionName: IPaymentType.PETITION_PREPARATION
    }

    const result = await this.paymentService.findSuccessfulPayment(payload);

    if(!result) throw new BadRequestException(`payment for petition preparation is required before proceeding to upoad documents`);

    return await this.documentRepository.create({petitionId: petitionDataJson.id, uploadedBy: user.id, ...data}, transaction);
}

async findUserDocument(user: IUser){
  const includeOption = {
    include: [
       {
         model: PetitionModel
       },
     ]
    }

    return await this.documentRepository.findAll({uploadedBy: user.id}, <unknown>includeOption);
}

async findDocumentByAdmin(petitionId: string){
   const includeOption = {
    include: [
       {
         model: PetitionModel
       },
     ]
    }
    
    return await this.documentRepository.findAll({petitionId}, <unknown>includeOption);
}

async deleteDocument(documentId: string, transaction: Transaction){
   return await this.documentRepository.delete({id: documentId}, transaction);
}

async activatePetition(user: IUser, transaction:Transaction){
    const payload: IFindPayment = {
      userId: user.id,
      paymentOptionName: IPaymentType.PETITION_PREPARATION
    }

    const result = await this.paymentService.findSuccessfulPayment(payload);

   if(!result) throw new BadRequestException(`payment for petition preparation is required before proceeding to upoad documents`);

   const now = new Date();

  const petitionData = await this.petitonRepository.update({userId: user.id}, {isPetitionActivated: true}, transaction);

  await this.petitionStageRepository.update({petitionId: petitionData["id"], weekNumber: 1}, {pendingSince: now}, transaction);

  const notification: INotification = {
    userId: user.id,
    recipientType: "USER",
    title: "petition activation status",
    message: `you have successfully activate your petition. we can now start working on your petition`
  }

  await this.auditTrailService.createNotification(notification, transaction);

  return petitionData
  
  }

async updatePetitionTimeline(id: string, data: UpdatePetitionTimelineDto, transaction: Transaction){
  const {weekNumber, weeklyReviewFile} = data;
  
  return await this.petitionStageRepository.update({weekNumber, petitionId: id}, {weeklyReviewFile, status: "IN_PROGRESS"}, transaction);
  
  }

async markPetitionTimeline(id: string, data: MarkPetitionTimelineDto, transaction: Transaction){
  const {weekNumber} = data;


  const weekPetitionStage = await this.petitionStageRepository.update({weekNumber, petitionId: id}, {status: "COMPLETE"}, transaction);

  const nextWeek = weekNumber+1;

  const now = new Date();

  if(nextWeek <= 5) await this.petitionStageRepository.update({weekNumber: nextWeek, petitionId: id}, {pendingSince: now}, transaction);

  if(weekNumber === 5) await this.petitonRepository.update({id}, {status: "completed"}, transaction);

  const includeOption = {
    include: [
       {
         model: UsersModel,
         attributes: ['firstName', 'lastName', 'email', 'id']
       },
      
     ]
    }

  const user = await this.petitonRepository.findOne({id: weekPetitionStage["petitionId"] }, <unknown>includeOption);

  const payload = {
      email: user["user"].email,
      firstName: user["user"].firstName,
      weekNumber
  }

  await this.weekMailSender(payload);

  return weekPetitionStage;
}

async unmarkPetitionTimeline(id: string, data: MarkPetitionTimelineDto, transaction: Transaction){
   const {weekNumber} = data;

   const weekPetitionStage = await this.petitionStageRepository.update({weekNumber, petitionId: id}, {status: "IN_PROGRESS"}, transaction);

   if(weekNumber === 5) await this.petitonRepository.update({id}, {status: "in_progress"}, transaction);

  const nextWeek = weekNumber+1;

  if(nextWeek <= 5) await this.petitionStageRepository.update({weekNumber: nextWeek, petitionId: id}, {pendingSince: null}, transaction);

  return weekPetitionStage;
}
  


  async getDocumentByAdmin(petitionId: string){
     const includeOption = {
      include: [
        {
          model: PetitionModel
        }
      ]
     }
     return await this.documentRepository.findAll({petitionId}, <unknown>includeOption);
  }


  async weekMailSender(data: {weekNumber: number, email: string, firstName: string}){
    const {weekNumber, email, firstName} = data;

    const payload = {
      weekNumber, 
      email,
      firstName
    }

    if(weekNumber === 1) await this.emailService.weekOneCompleted(payload);

    if(weekNumber === 2) await this.emailService.weekTwoCompleted(payload);

    if(weekNumber === 3) await this.emailService.weekThreeCompleted(payload);

    if(weekNumber === 4){
      await this.emailService.weekFourCompleted(payload);

      await this.emailService.weekFourSecondMail({email: payload.email, firstName: payload.firstName});
    } 

    if(weekNumber === 5) await this.emailService.weekFiveCompleted(payload);
  }

}
