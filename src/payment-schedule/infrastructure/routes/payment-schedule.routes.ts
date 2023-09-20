import Express from 'express';
import { PaymentScheduleAdapter } from '../adapters/payment-schedule.adapter';
import { FindPaymentScheduleUsecase } from '../../../payment-schedule/application/find-payment-schedule.use-case';
import { PaymentScheduleController }  from '../../../payment-schedule/infrastructure/controllers/payment-schedule.controller';

const routes = Express.Router();

const paymentScheduleAdapter = new PaymentScheduleAdapter();
const paymentScheduleUsecase = new FindPaymentScheduleUsecase(paymentScheduleAdapter);
const paymentController = new PaymentScheduleController(paymentScheduleUsecase);

routes.get('/payment-schedule/:id', paymentController.findPaymentSchedule);

export default routes;