import { DebtRelief } from '../domain/model/debt-relief.model';
import { DebtWaiverRepository } from '../domain/repositories/debt-waiver.repository';

export class FindDebtReliefUsecase {
    constructor(private debtWaiverRepository: DebtWaiverRepository) { }

    execute = async (creditCode: string, paymentNumber: number, collectionLocationCode: string, idCorrelative: number): Promise<DebtRelief> => {
        return await this.debtWaiverRepository.find(creditCode, paymentNumber, collectionLocationCode, idCorrelative);
    };

}