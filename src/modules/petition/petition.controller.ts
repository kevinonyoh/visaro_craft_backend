import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put, Query } from '@nestjs/common';
import { PetitionService } from './petition.service';
import { CreatePetitionDto, DocumentsDto, QueryPetitionDto, UpdatePetitionStatusDto, UpdatePetitionTimelineDto } from './dto/create-petition.dto';
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
  @Put("update-petition-status/:id")
  @HttpCode(200)
  @ResponseMessage("petition status updated successfully")
  async updatePetitionStatus(@Param("id") id: string, @Body() body: UpdatePetitionStatusDto, @TransactionParam() transaction: Transaction){
     return await this.petitionService.updatePetitionStatus(id, body, transaction);
  }
 
  @Get("user-petition")
  @HttpCode(200)
  @ResponseMessage("User petition")
  async getUserPetition(@User() user: IUser){
      return await this.petitionService.findUserPetition(user);
  }


  @IsAdmin()
  @Get("view-petition/:id")
  @HttpCode(200)
  @ResponseMessage("User petition")
  async viewPetition(@Param("id") id: string){
      return await this.petitionService.findPetition(id);
  }

  @IsAdmin()
  @Get("all")
  @HttpCode(200)
  @ResponseMessage("User petition")
  async getAllPetition(@Query() query: QueryPetitionDto){
      return await this.petitionService.findAllPetition(query);
  }

  @Post("upload-document")
  @HttpCode(200)
  @ResponseMessage("document upload successfully")
  async uploadDocument(@User() user: IUser, @Body() body: DocumentsDto, @TransactionParam() transaction: Transaction){
      return await this.petitionService.uploadDocument(user, body, transaction);
  }

  @Put("activate-petition/:petitionId")
  @HttpCode(200)
  @ResponseMessage("petition activated successfully")
  async activatePetition(@User() user: IUser, @Param("petitionId") petitionId: string, @TransactionParam() transaction: Transaction){
      return await this.petitionService.activatePetition(user, petitionId, transaction);
  }

  @IsAdmin()
  @Put("update-petition-timeline/:petitionId")
  @HttpCode(200)
  @ResponseMessage("petition timeline update successfully")
  async updatePetitionTimeline(@Param("petitionId") id: string, @Body() body: UpdatePetitionTimelineDto, @TransactionParam() transaction: Transaction){
      return await this.petitionService.updatePetitionTimeline(id, body, transaction);
  }

}
