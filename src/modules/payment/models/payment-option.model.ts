import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table({
    tableName: "payment_options",
    modelName: "PaymentOptionsModel",
    underscored: true,
    freezeTableName: true
})
export class PaymentOptionsModel extends Model<PaymentOptionsModel>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    amount: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        defaultValue: 'usd',
    })
    currency: string;
}