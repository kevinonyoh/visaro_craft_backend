import { All } from "@nestjs/common";
import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/users/models/users.model";
import { IPetitionStatus, IPetitionTimeline, IPetitionType } from "../interface/petition.interface";
import { PaymentModel } from "src/modules/payment/models/payment.model";
import { PetitionStageModel } from "./petition-stage.model";

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

    @AllowNull
    @Column(DataType.BOOLEAN)
    isPetitionActivated: boolean;

    @BelongsTo(() => UsersModel)
    user: UsersModel;

    @HasMany(()=> PaymentModel)
    payment: PaymentModel;

    @HasMany(() => PetitionStageModel)
    stage: PetitionStageModel;

    @Default("pending")
    @Column(DataType.ENUM('pending', 'in_progress', 'completed'))
    status: string;
}