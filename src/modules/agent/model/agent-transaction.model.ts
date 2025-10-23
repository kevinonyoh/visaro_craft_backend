import { AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AgentsModel } from "./agent.model";
import { IAgentTransactionStatus } from "../interfaces/agent.interface";
import { AdminModel } from "src/modules/admin/model/admin.model";



@Table({
    tableName: "agent_transactions",
    modelName: "AgentTransactionModel",
    underscored: true,
    freezeTableName: true
})
export class AgentTransactionModel extends Model<AgentTransactionModel>{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => AgentsModel)
    @AllowNull(false)
    @Column(DataType.STRING(128))
    agentId!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    amount: number;

    @AllowNull(false)
    @Default(IAgentTransactionStatus.PENDING)
    @Column(DataType.ENUM(...Object.values(IAgentTransactionStatus)))
    status: IAgentTransactionStatus;

    @ForeignKey(() => AdminModel)
    @AllowNull(true)
    @Column(DataType.STRING)
    approvedBy: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    approvedAt: Date;

    @AllowNull(true)
    @Column(DataType.STRING)
    remark: string;
}