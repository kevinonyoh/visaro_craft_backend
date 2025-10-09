import { IsEnum, IsNotEmpty } from "class-validator";
import { IPetitionStatus, IPetitionType } from "../interface/petition.interface";

export class CreatePetitionDto {
    @IsEnum(IPetitionType)
    @IsNotEmpty()
    petitionType: IPetitionType
}

export class UpdatePetitionStatusDto{
    @IsEnum(IPetitionStatus)
    @IsNotEmpty()
    petitionStatus: IPetitionStatus
}