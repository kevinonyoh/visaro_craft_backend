import { IsOptional, IsString } from "class-validator";

export class CreateAuditTrailDto {}


export class GetoAuditTrailDto{
    @IsString()
    @IsOptional()
    agentId: string;
}