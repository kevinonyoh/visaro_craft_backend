import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { PetitionModel } from "./petition.model";
import { UsersModel } from "src/modules/users/models/users.model";

@Table({
    tableName: "documents",
    modelName: "DocumentsModel",
    underscored: true,
    freezeTableName: true,
  })
  export class DocumentsModel extends Model<DocumentsModel> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @AllowNull(false)
    @ForeignKey(() => PetitionModel)
    @Column(DataType.UUID)
    petitionId!: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    fileName!: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    fileUrl!: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    publicId!: string;
  
    @AllowNull(true)
    @ForeignKey(() => UsersModel)
    @Column(DataType.UUID)
    uploadedBy?: string;
  
    @BelongsTo(() => PetitionModel)
    petition!: PetitionModel;
  
    @BelongsTo(() => UsersModel)
    uploader!: UsersModel;
  }