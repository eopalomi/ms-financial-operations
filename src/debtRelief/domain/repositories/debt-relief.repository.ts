import { DebtRelief } from '../model/debt-relief.model';

export type DebtReliefRepository = {
  save(DebtWaiver: DebtRelief): Promise<void>;
  cancel(): Promise<void>;
  find(creditCode: string, paymentNumber: number, collectionLocationCode: string, idCorrelative: number): Promise<DebtRelief>;
  findAll(creditCode: string): Promise<DebtRelief[]>;
};
