import { DebtRelief } from '../model/debt-relief.model';

export type DebtWaiverRepository = {
  save(DebtWaiver: DebtRelief): Promise<void>;
  cancel(): Promise<void>;
  find(creditCode: string, paymentNumber: number, collectionLocationCode: string, idCorrelative: number): Promise<DebtRelief>;
  findAll(): Promise<DebtRelief[]>;
};
