import { DebtRelief } from '../../domain/model/debt-relief.model';
import { DebtReliefRepository } from '../../domain/repositories/debt-relief.repository';

export class FindDebtReliefUsecase {
    constructor(private debtReliefRepository: DebtReliefRepository) { }

    findAll = async (creditCode: string): Promise<DebtRelief[]> => {
        return await this.debtReliefRepository.findAll(creditCode);
    };
}