import { All } from "@nestjs/common";
import { AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/users/models/users.model";
import { IPetitionStatus, IPetitionTimeline, IPetitionType } from "../interface/petition.interface";

@Table({
    tableName: "petitions",
    modelName: "PetitionModel",
    underscored: true,
    freezeTableName: true
})
export class PetitionModel extends Model<PetitionModel>{
    
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => UsersModel)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId: string;

    @AllowNull(false)
    @Column(DataType.ENUM(IPetitionType.EXTRAORDINARY_ABILITY, IPetitionType.EXTRAORDINARY_TALENT, IPetitionType.NATIONAL_INTEREST_WAIVER))
    petitionType: IPetitionType;

    @Default(IPetitionStatus.PENDING)
    @Column(DataType.ENUM(IPetitionStatus.APPROVED, IPetitionStatus.DECLINED, IPetitionStatus.PENDING))
    petitionStatus: IPetitionStatus;

    @AllowNull
    @Column(DataType.ENUM(IPetitionTimeline.REVIEW, IPetitionTimeline.COVER_LETTER_AND_CRITERIA_MET, IPetitionTimeline.US_BENEFIT_AND_ENDEAVOR, IPetitionTimeline.FINAL_MERIT_AND_CONCLUSION, IPetitionTimeline.EXHIBITA_AND_FINAL_REVIEW))
    petitionTimeline: IPetitionTimeline;
}