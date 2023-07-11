import Express from 'express'
import { DebtReliefController } from '../controllers/debt-relief.controller';
import { DebtReliefRepository } from '../repositories/debt-relief.repository';
import { CreateDebtReliefUsecase } from '../../application/create-debt-relief.use-case';

const routes = Express.Router();

const debtReliefRepository = new DebtReliefRepository();
const debtReliefUsecase = new CreateDebtReliefUsecase(debtReliefRepository);
const debtController = new DebtReliefController(debtReliefUsecase);

routes.post('/debt-relief', debtController.createDebtRelief);

export { routes };