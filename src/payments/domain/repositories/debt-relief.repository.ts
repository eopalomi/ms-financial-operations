import { DebtRelief } from '../model/debt-relief.model';

export type PaymentSchedule = {
   creditCode: string;
   installments: Array<{
      numberPayment: number;
      paymentDate: string;
      principal: number;
      interest: number;
      vehicleInsurance: number;
      lifeInsurance: number;
      igvInsurance: number;
      preventionInsurance: number;
      principalBalance: number;
      interestBalance: number;
      feesbalance: number;
      vehicleInsuranceBalance: number;
      lifeInsuranceBalance: number;
      igvInsuranceBalance: number;
      preventionInsuranceBalance: number;
   }>;
};

export type DebtReliefRepository = {
   save(DebtWaiver: DebtRelief): Promise<void>;
   delete(creditCode: string, idPayment: number, personCode: string, ip:string): Promise<void>;
   find(creditCode: string, paymentNumber: number, collectionLocationCode: string, idCorrelative: number): Promise<DebtRelief>;
   findAll(creditCode: string): Promise<DebtRelief[]>;
   findPaymentSchedule(creditCode: string): Promise<PaymentSchedule>;
};
