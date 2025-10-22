import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { ExcludeFieldsFromJSON } from "src/common/utils/helper";
import { AgentRewardsModel } from "src/modules/agent/model/agent-reward.model";
import { AgentsModel } from "src/modules/agent/model/agent.model";
import { PaymentModel } from "src/modules/payment/models/payment.model";
import { PetitionModel } from "src/modules/petition/model/petition.model";


@Table({
    tableName: "users",
    modelName: "UsersModel",
    underscored: true,
    freezeTableName: true
})
export class UsersModel extends Model<UsersModel>{
 
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column
    firstName!: string;

    @AllowNull(false)
    @Column
    lastName!: string;

    @AllowNull(false)
    @Unique
    @Column
    email!: string;

    @AllowNull(true)
    @Column
    password?: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    isEmailVerified!: boolean;
    
    @Default(false)
    @Column(DataType.BOOLEAN)
    isActivated!: boolean;

    @AllowNull(true)
    @Column
    cvUrl: string;

    @AllowNull(true)
    @Column
    cvPublicId: string;

    @AllowNull(true)
    @Column
    phoneNumber: string;

    @AllowNull(true)
    @Column
    countryCode: string;

    @ForeignKey(() => AgentsModel)
    @AllowNull(true)
    @Column(DataType.STRING(128))
    agentId: string;

    @AllowNull(true)
    @Column
    profilePicture: string;

    @HasOne(() => PetitionModel)
    petition: PetitionModel;

    @HasMany(()=> PaymentModel)
    payment: PaymentModel;

    @HasOne(()=> AgentRewardsModel)
    AgentReward: AgentRewardsModel;

    @BelongsTo(()=> AgentsModel)
    Agent: AgentsModel;

    toJSON() {
        const data = Object.assign({}, this.get())

        const { password, deletedAt, ...rest } = data;

        return rest;
    }
}    