import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({
    tableName: "activities",
    modelName: "ActivitiesModel",
    underscored: true,
    freezeTableName: true
})
export class ActivitiesModel extends Model<ActivitiesModel>{

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    description: string;
}
