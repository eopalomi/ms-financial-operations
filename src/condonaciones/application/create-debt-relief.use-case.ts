import { DebtRelief } from '../domain/model/debt-relief.model';
import { DebtWaiverRepository } from '../domain/repositories/debt-waiver.repository';

export class CreateDebtReliefUsecase {
  constructor(private debtWaiverRepository: DebtWaiverRepository) { }

  execute = async (debtRelief: DebtRelief): Promise<void> => {
    await this.debtWaiverRepository.save(debtRelief);
  };

}