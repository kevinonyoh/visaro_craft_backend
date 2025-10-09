import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePetitionDto, UpdatePetitionStatusDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { IUser } from '../users/interfaces/user.interface';
import { PetitionRepository } from './repositories/petition.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class PetitionService {

  constructor(private readonly petitonRepository: PetitionRepository){}

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

}
