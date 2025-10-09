import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { PetitionService } from './petition.service';
import { CreatePetitionDto, UpdatePetitionStatusDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from '../users/interfaces/user.interface';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';

@Controller('petition')
export class PetitionController {
  constructor(private readonly petitionService: PetitionService) {}

  @Post("create-petition")
  @HttpCode(201)
  @ResponseMessage("petition successfully created")
  async create(@User() user: IUser, @Body() createPetitionDto: CreatePetitionDto, @TransactionParam() transaction: Transaction) {
    return await this.petitionService.createPetition(user, createPetitionDto, transaction);
  }

  @IsAdmin()
  @Put("update-petition/:id")
  @HttpCode(200)
  @ResponseMessage("petition status updated successfully")
  async updatePetitionStatus(@Param("id") id: string, @Body() body: UpdatePetitionStatusDto, @TransactionParam() transaction: Transaction){
     return await this.petitionService.updatePetitionStatus(id, body, transaction);
  }
 
}
