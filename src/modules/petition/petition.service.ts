import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePetitionDto, DocumentsDto, QueryPetitionDto, UpdatePetitionStatusDto, UpdatePetitionTimelineDto } from './dto/create-petition.dto';
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
import { IPetitionTimeline } from './interface/petition.interface';
import { PetitionStageRepository } from './repositories/Petition-stage.repository';
import { PetitionStageModel } from './model/petition-stage.model';
import { AuditTrailService } from '../audit-trail/audit-trail.service';


@Injectable()
export class PetitionService {

  constructor(
    private readonly petitonRepository: PetitionRepository,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly documentRepository: DocumentRepository,
    private readonly petitionStageRepository: PetitionStageRepository,
    private readonly auditTrailService: AuditTrailService
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

    return {...petitionJson};
  }

  async updatePetitionStatus(id: string, data: UpdatePetitionStatusDto, transaction: Transaction){
    const {petitionStatus} = data;

    return await this.petitonRepository.update({id}, {petitionStatus}, transaction);
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
           model: PaymentModel
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
         model: PaymentModel
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

  return await this.petitonRepository.update({userId: user.id}, {isPetitionActivated: true}, transaction);

}

async updatePetitionTimeline(id: string, data: UpdatePetitionTimelineDto, transaction: Transaction){
    const {petitionTimeline} = data;
    const petition = await this.petitonRepository.findOne({id});

    const petitionJson = petition.toJSON();

    if(!petitionJson.isPetitionActivated) throw new BadRequestException("Petition is yet to be activated by this user")
    
    return await this.petitonRepository.update({id}, {petitionTimeline}, transaction);
  }
}
