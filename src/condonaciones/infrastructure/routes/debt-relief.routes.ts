import Express from 'express'
import { DebtReliefController } from '../controllers/debt-relief.controller';
import { DebtReliefRepository } from '../repositories/debt-relief.repository';
import { CreateDebtReliefUsecase } from '../../application/create-debt-relief.use-case';
import { PaymentScheduleRepositoryHTTP } from '../repositories/payment-schedule.repository';
import { FindPaymentScheduleUsecase } from '../../application/find-payment-schedule.use-case';
import { PaymentScheduleController } from '../controllers/payment-schedule.controller';

const routes = Express.Router();

const debtReliefRepository = new DebtReliefRepository();
const debtReliefUsecase = new CreateDebtReliefUsecase(debtReliefRepository);
const debtController = new DebtReliefController(debtReliefUsecase);



const paymentScheduleRepository = new PaymentScheduleRepositoryHTTP();
const paymentScheduleUsecase = new FindPaymentScheduleUsecase(paymentScheduleRepository);
const paymentController = new PaymentScheduleController(paymentScheduleUsecase);

routes.post('/debt-relief', debtController.createDebtRelief);
routes.get('/payment-schedule', paymentController.findPaymentSchedule);

export { routes };