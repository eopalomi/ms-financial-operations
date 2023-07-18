import { DebtRelief } from '../domain/model/debt-relief.model';
import { DebtReliefRepository } from '../domain/repositories/debt-relief.repository';
import { DebtReliefService } from './services/debt-relief.service';

export class CreateDebtReliefUsecase {
  debtReliefService: DebtReliefService;

  constructor(private debtWaiverRepository: DebtReliefRepository) {
    this.debtReliefService = new DebtReliefService()
  }

  execute = async (debtRelief: DebtRelief): Promise<void> => {
    const amounts = await this.debtReliefService.installmentAmounts(debtRelief.creditCode, debtRelief.numberPayment)

    if (!amounts) {
      throw new Error("installment number not found");
    }
    if (
      debtRelief.principalAmount > amounts.principalBalance ||
      debtRelief.interestAmount > amounts.interestBalance ||
      debtRelief.lateFeeAmount > amounts.feesbalance ||
      debtRelief.vehicleInsurance > amounts.vehicleInsuranceBalance ||
      debtRelief.lifeInsurance > amounts.lifeInsuranceBalance ||
      debtRelief.igvInsurance > amounts.igvInsuranceBalance ||
      debtRelief.preventionInsurance > amounts.preventionInsuranceBalance
    ) {
      throw new Error("amount greater than installment balance");
    }

    await this.debtWaiverRepository.save(debtRelief);
  };
}