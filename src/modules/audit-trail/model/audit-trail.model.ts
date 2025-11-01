import { AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AgentsModel } from "src/modules/agent/model/agent.model";


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

    @ForeignKey(() => AgentsModel)
    @AllowNull(true)
    @Column(DataType.STRING(128))
    agentId!: string;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    amount: number;

    
    @AllowNull(false)
    @Column(DataType.TEXT)
    description: string;
}
