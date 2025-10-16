import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePetitionDto, DocumentsDto, QueryPetitionDto, UpdatePetitionStatusDto, UpdatePetitionTimelineDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { IUser } from '../users/interfaces/user.interface';
import { PetitionRepository } from './repositories/petition.repository';
import { Transaction } from 'sequelize';
import { PaymentService } from '../payment/payment.service';
import { DocumentRepository } from './repositories/document.repository';
import { IFindPayment, IPaymentType } from '../payment/interface/payment.interface';

@Injectable()
export class PetitionService {

  constructor(
    private readonly petitonRepository: PetitionRepository,
    private readonly paymentService: PaymentService,
    private readonly documentRepository: DocumentRepository
    ){}

  async createPetition(user: IUser,data: CreatePetitionDto, transaction: Transaction) {
    const userData = await this.petitonRepository.findOne({userId: user.id});

    if(userData) throw new BadRequestException("user cannot create more than one petition");

     const {petitionType} = data;

     const payload = {
      petitionType,
      userId: user.id
     }

     return await this.petitonRepository.create(payload, transaction);
  }

  async updatePetitionStatus(id: string, data: UpdatePetitionStatusDto, transaction: Transaction){
    const {petitionStatus} = data;

    return await this.petitonRepository.update({id}, {petitionStatus}, transaction);
  }

  async findUserPetition(user: IUser){
     return await this.petitonRepository.findOne({userId: user.id});
  }

  async findPetition(id: string){
    return await this.petitonRepository.findOne({id});
 }

 async findAllPetition(data: QueryPetitionDto){
  return await this.petitonRepository.findAll({...data});
}

async uploadDocument(user: IUser, data: DocumentsDto, transaction: Transaction){
    const {petitionId, ...rest} = data;

    const payload: IFindPayment = {
      userId: user.id,
      petitionId,
      paymentOptionName: IPaymentType.PETITION_PREPARATION
    }

    const result = await this.paymentService.findSuccessfulPayment(payload);

    if(!result) throw new BadRequestException(`payment for petition preparation is required before proceeding to upoad documents`);

    return await this.documentRepository.create({petitionId, uploadedBy: user.id, ...rest}, transaction);
}

async activatePetition(user: IUser, petitionId: string, transaction:Transaction){
    const payload: IFindPayment = {
      userId: user.id,
      petitionId,
      paymentOptionName: IPaymentType.PETITION_PREPARATION
    }

    const result = await this.paymentService.findSuccessfulPayment(payload);

   if(!result) throw new BadRequestException(`payment for petition preparation is required before proceeding to upoad documents`);

  return await this.petitonRepository.update({id: petitionId, userId: user.id}, {isPetitionActivated: true}, transaction);

}

async updatePetitionTimeline(id: string, data: UpdatePetitionTimelineDto, transaction: Transaction){
    const {petitionTimeline} = data;
    const petition = await this.petitonRepository.findOne({id});

    const petitionJson = petition.toJSON();

    return petition;

    // if(!petitionJson.isPetitionActivated) throw new BadRequestException("Petition is yet to be activated by this user")
    
    // return await this.petitonRepository.update({id}, {petitionTimeline}, transaction);
  }
}
