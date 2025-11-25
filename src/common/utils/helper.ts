import { JwtService } from "@nestjs/jwt";
import { Op } from "sequelize";
import { AdminModel } from "src/modules/admin/model/admin.model";
import { AgentsModel } from "src/modules/agent/model/agent.model";
import { IPaymentType } from "src/modules/payment/interface/payment.interface";
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

export const paymentName = (paymentType: IPaymentType) => {
  if(paymentType === IPaymentType.CONSULTATION) return "Your Payment for booking of consultation session";

  if(paymentType === IPaymentType.PETITION_PREPARATION) return "$4000 first payment for preparation of petition";

  if(paymentType === IPaymentType.REVIEW_PETITION) return "$4000 Outstanding Second Tranche Payment"
}


export const paymentDescription = (paymentType: IPaymentType) => {
  if (paymentType === IPaymentType.CONSULTATION) return "This payment covers your booking fee for the immigration consultation session. You will receive expert guidance, case review, and recommendations tailored to your petition type.";

  if (paymentType === IPaymentType.PETITION_PREPARATION) return "This payment represents the initial $4,000 installment for the preparation of your immigration petition. It covers document review, drafting, evidence organization, and strategy planning.";

  if (paymentType === IPaymentType.REVIEW_PETITION) return "This payment covers the outstanding $4,000 balance for the second tranche of your petition preparation service. It completes your total petition processing fee.";
};
