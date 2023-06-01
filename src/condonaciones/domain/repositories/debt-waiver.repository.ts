import { DebtWaiver } from "../model/debt-waiver.model";

export type DebtWaiverRepository = {
    save(): Promise<void>;
    cancel(): Promise<void>;
    find(): Promise<DebtWaiver>;
    findAll(): Promise<DebtWaiver[]>;
}