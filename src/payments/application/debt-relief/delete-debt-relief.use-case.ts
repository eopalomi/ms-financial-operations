import { DebtReliefRepository } from '../../domain/repositories/debt-relief.repository';

export class DeleteDebtReliefUseCase {
   constructor(private debtReliefRepository: DebtReliefRepository) { }

   execute = async (creditCode: string, idPayment: number, personCode: string, ip:string) => {
      await this.debtReliefRepository.delete(creditCode, idPayment, personCode, ip);
   };
}