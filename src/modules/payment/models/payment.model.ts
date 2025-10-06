import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/users/models/users.model";
import { IStatus } from "../interface/payment.interface";



@Table({
    tableName: "payments",
    modelName: "PaymentModel",
    underscored: true,
    freezeTableName: true
})
export class PaymentModel extends Model<PaymentModel>{
    
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => UsersModel)
    @AllowNull(false)
    @Column(DataType.STRING(128))
    userId!: string;

    @BelongsTo(() => UsersModel)
    user!: UsersModel;

    @AllowNull(false)
    @Column(DataType.STRING(128))
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING(128))
    stripeId?: string;

    @AllowNull(false)
    @Column(DataType.STRING(128))
    stripeClientSecret?: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    amount!: number;

    @Default(IStatus.PENDING)
    @Column(DataType.ENUM(IStatus.FAILED, IStatus.PENDING, IStatus.SUCCESSFUL))
    status!:IStatus;

    @AllowNull(false) 
    @Column(DataType.STRING)
    serviceType: string;


}