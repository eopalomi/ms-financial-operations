import { PaymentScheduleRepository } from '../../domain/repositories/payment-schedule.repository';
import { PaymentScheduleAdapter } from '../../infrastructure/adapters/payment-schedule.adapter';

export class PaymentScheduleService {
   private paymentScheduleRepository: PaymentScheduleRepository;
    
   constructor() { 
      this.paymentScheduleRepository = new PaymentScheduleAdapter();
   }

   findPaymentSchedule = async (creditCode: string) => {
      return await this.paymentScheduleRepository.find(creditCode);
   };
}