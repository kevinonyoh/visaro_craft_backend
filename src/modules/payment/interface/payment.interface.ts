export enum IPaymentType{
  CONSULTATION = "CONSULTATION",
  PETITION_PREPARATION = "PETITION_PREPARATION",
  REVIEW_PETITION = "REVIEW_PETITION"
}


export enum IStatus{
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESSFUL = 'successful'
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
  payment_method_types?: string[]; 
  payment_method?: string; 
}

export interface IFindPayment{
  userId: string;
  paymentOptionName: IPaymentType;
  PaymentOptionsId?: string;
  email?: string;
  checkoutSessionId?: string; 
}