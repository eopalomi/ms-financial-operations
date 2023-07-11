import { DebtRelief } from '../domain/model/debt-relief.model';
import { DebtWaiverRepository } from '../domain/repositories/debt-waiver.repository';
import { DebtReliefService } from './services/debt-relief.service';

export class CreateDebtReliefUsecase {
  debtReliefService: DebtReliefService;

  constructor(private debtWaiverRepository: DebtWaiverRepository) {
    this.debtReliefService = new DebtReliefService()
  }

  execute = async (debtRelief: DebtRelief): Promise<void> => {
    const isOk = this.debtReliefService.validateInstallment(debtRelief.creditCode, debtRelief.numberPayment)

    await this.debtWaiverRepository.save(debtRelief);
  };



}