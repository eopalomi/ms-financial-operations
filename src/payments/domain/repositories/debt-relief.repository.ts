import { DebtRelief } from '../model/debt-relief.model';

export type DebtReliefRepository = {
  save(DebtWaiver: DebtRelief): Promise<void>;
  delete(creditCode: string, idPayment: number): Promise<void>;
  find(creditCode: string, paymentNumber: number, collectionLocationCode: string, idCorrelative: number): Promise<DebtRelief>;
  findAll(creditCode: string): Promise<DebtRelief[]>;
};
