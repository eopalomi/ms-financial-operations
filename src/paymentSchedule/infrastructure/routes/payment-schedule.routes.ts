import Express from 'express'
import { PaymentScheduleRepositoryHTTP } from '../../../paymentSchedule/infrastructure/repositories/payment-schedule.repository';
import { FindPaymentScheduleUsecase } from '../../../paymentSchedule/application/find-payment-schedule.use-case';
import { PaymentScheduleController } from '../../../paymentSchedule/infrastructure/controllers/payment-schedule.controller';

const routes = Express.Router();

const paymentScheduleRepository = new PaymentScheduleRepositoryHTTP();
const paymentScheduleUsecase = new FindPaymentScheduleUsecase(paymentScheduleRepository);
const paymentController = new PaymentScheduleController(paymentScheduleUsecase);

routes.get('/payment-schedule/:id', paymentController.findPaymentSchedule);

export default routes;