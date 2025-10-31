import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { PetitionModel } from "./petition.model";
import { IPetitionTimeline } from "../interface/petition.interface";



@Table({
    tableName: "petition_stages",
    modelName: "PetitionStageModel",
    underscored: true,
    freezeTableName: true,
  })
export class PetitionStageModel extends Model<PetitionStageModel> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @AllowNull(false)
    @ForeignKey(() => PetitionModel)
    @Column(DataType.UUID)
    petitionId: string;
  
    @AllowNull(false)
    @Column(DataType.INTEGER)
    weekNumber: number;
  
    @AllowNull(false)
    @Column(
      DataType.ENUM(...Object.values(IPetitionTimeline))
    )
    stage: string;
  
    @Default("PENDING")
    @Column(DataType.ENUM("PENDING", "IN_PROGRESS", "COMPLETE"))
    status: string;
  
    @AllowNull(true)
    @Column(DataType.DATE)
    startedAt?: Date;
  
    @AllowNull(true)
    @Column(DataType.DATE)
    completedAt?: Date;

    @AllowNull(true)
    @Column
    weeklyReviewFile: string;
  
    @BelongsTo(() => PetitionModel)
    petition!: PetitionModel;
  }