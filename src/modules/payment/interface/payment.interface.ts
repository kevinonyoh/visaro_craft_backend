export enum IPaymentType{
  CONSULTATION = "consultation",
  FIRST_INSTALLMENT = "first_installment",
  SECOND_INSTALLMENT = "second_installment"
}

export interface IPaymentIntent{
  amount: number;
  currency: string;
  description: string;
  metadata: {
    paymentType: string;
    userId: string;
  };
  receipt_email: string;
  payment_method_types: string[]; 
}