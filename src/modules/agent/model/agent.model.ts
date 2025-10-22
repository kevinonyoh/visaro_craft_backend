import { AllowNull, Column, DataType, Default, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { IAgentBank } from "../interfaces/agent.interface";
import { UsersModel } from "src/modules/users/models/users.model";


@Table({
    tableName: "agents",
    modelName: "AgentsModel",
    underscored: true,
    freezeTableName: true
})
export class AgentsModel extends Model<AgentsModel> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @AllowNull(false)
    @Column
    firstName: string;
  
    @AllowNull(false)
    @Column
    lastName: string;
  
    @Unique
    @AllowNull(false)
    @Column
    email: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    username: string;
  
    @AllowNull(true)
    @Column
    password?: string;
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isActivated!: boolean;
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isEmailVerified!: boolean;
  
    @AllowNull(false)
    @Column(DataType.JSON)
    bank: IAgentBank;
  
    @AllowNull(false)
    @Column
    pin!: string;

    @HasMany(()=> UsersModel)
    user: UsersModel;
  
    toJSON() {
      const data = Object.assign({}, this.get());
      const { password, pin, ...rest } = data;
      return rest;
    }
  }