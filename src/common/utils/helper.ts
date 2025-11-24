import { JwtService } from "@nestjs/jwt";
import { Op } from "sequelize";
import { AdminModel } from "src/modules/admin/model/admin.model";
import { AgentsModel } from "src/modules/agent/model/agent.model";
import { IPetitionStatus } from "src/modules/petition/interface/petition.interface";
import { UsersModel } from "src/modules/users/models/users.model";

export const generateRandomPassword = () => {
    const specialChars = ['@', '#', '$', '%', '&', '!'];

    const smallChars = Math.random().toString(36).slice(2, 6);

    const bigChars = Math.random().toString(36).slice(2, 6).toUpperCase();

    const randomNum = Math.floor(Math.random()*specialChars.length);

    return `${specialChars[randomNum]}${smallChars}${bigChars}${randomNum}`;
};



export const generateOtp = () => {
  return Math.random().toString().slice(2, 8);
};

export const getSearchConditions = (searchValue: string, searchColumns: string[]): Record<symbol, unknown> => {
  const searchQuery = {
    [Op.iLike]: `%${searchValue}%`
  };

  const searchConditions = searchColumns.map(val => ({[val]: searchQuery}));

  return {
    [Op.or]: searchConditions
  };
}

// ExcludeFieldsFromJSON can be used as a decorator or a normal function. E.g Decorator - @ExcludeFieldsFromJSON(['password'])
export function ExcludeFieldsFromJSON(fields: string[]) {
  return function (constructor: Function) {
    constructor.prototype.toJSON = function () {
      const data = this.get({ plain: true });
      for (const field of fields) {
        delete data[field];
      }
      return data;
    };
  };
}


export const referenceGenerator = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 20; i++) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  result += characters[randomIndex];
  }

  return result;
}

export const getAccessToken = async (user: UsersModel | AdminModel | AgentsModel, jwtService: JwtService, configServiceCallback: () => string) => {
  const secret = configServiceCallback();

  return await jwtService.signAsync({ id: user.id, email: user.email }, { secret });
};


export const petitionConsultationNotification = (petitionStatus: IPetitionStatus) => {
  if(petitionStatus === IPetitionStatus.APPROVED) return "Good news! Your consultation went well and we are happy to work with you.";
  
  if(petitionStatus === IPetitionStatus.DECLINED) return "Unfortunately, your consultation did not go as expected. We appreciate your time, and we hope to assist you better in the future."

}