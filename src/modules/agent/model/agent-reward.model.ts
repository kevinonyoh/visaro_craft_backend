import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/users/models/users.model";
import { IAgentRewardStatus } from "../interfaces/agent.interface";



@Table({
    tableName: "agent-rewards",
    modelName: "AgentRewardsModel",
    underscored: true,
    freezeTableName: true
})
export class AgentRewardsModel extends Model<AgentRewardsModel>{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => UsersModel)
    @AllowNull(false)
    @Column(DataType.STRING(128))
    userId!: string;

    @AllowNull(false)
    @Default(IAgentRewardStatus.PENDING)
    @Column(DataType.ENUM(IAgentRewardStatus.COMPLETED, IAgentRewardStatus.IN_PROGRESS, IAgentRewardStatus.PENDING))
    status: IAgentRewardStatus;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    stage: number;

    @Column(DataType.INTEGER)
    rewardAmount: number;
    
    @BelongsTo(()=> UsersModel)
    user: UsersModel;
}