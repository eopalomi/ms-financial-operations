import { DebtWaiver } from '../model/debt-waiver.model';

export type DebtWaiverRepository = {
  save(DebtWaiver: DebtWaiver): Promise<void>;
  cancel(): Promise<void>;
  find(): Promise<DebtWaiver>;
  findAll(): Promise<DebtWaiver[]>;
};
