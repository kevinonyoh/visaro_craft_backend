import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { ExcludeFieldsFromJSON } from "src/common/utils/helper";


@Table({
    tableName: "admins",
    modelName: "AdminModel",
    underscored: true,
    freezeTableName: true
})
export class AdminModel extends Model<AdminModel>{
 
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

    toJSON() {
        const data = Object.assign({}, this.get())

        const { password, deletedAt, ...rest } = data;

        return rest;
    }
}    