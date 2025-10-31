import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IPetitionStatus, IPetitionTimeline, IPetitionType } from "../interface/petition.interface";

export class CreatePetitionDto {
    @IsEnum(IPetitionType)
    @IsNotEmpty()
    petitionType: IPetitionType;
}

export class UpdatePetitionStatusDto{
    @IsEnum(IPetitionStatus)
    @IsNotEmpty()
    petitionStatus: IPetitionStatus;
}

export class QueryPetitionDto{
    @IsEnum(IPetitionStatus)
    @IsOptional()
    petitionStatus: IPetitionStatus;

    @IsEnum(IPetitionType)
    @IsOptional()
    petitionType: IPetitionType;

    @IsEnum(IPetitionTimeline)
    @IsOptional()
    petitionTimeline: IPetitionTimeline;

}


export class DocumentsDto{
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsString()
    @IsNotEmpty()
    publicId: string;
}

export class UpdatePetitionTimelineDto{
   
    @IsNumber()
    @IsNotEmpty()
    weekNumber: number;

    @IsString()
    @IsNotEmpty()
    weeklyReviewFile: string

}

