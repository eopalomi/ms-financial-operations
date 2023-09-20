import Express from 'express';
import { DebtReliefController } from '../controllers/debt-relief.controller';
import { DebtReliefAdapter } from '../adapters/debt-relief.adapter';
import { CreateDebtReliefUsecase } from '../../application/debt-relief/create-debt-relief.use-case';
import { FindDebtReliefUsecase } from '../../application/debt-relief/find-debt-relief.use-case';
import { DeleteDebtReliefUseCase } from '../../application/debt-relief/delete-debt-relief.use-case';
import { SimulateDebtReliefUsecase } from '../../application/debt-relief/simulate-debt-relief.use-case';

const routes = Express.Router();

const debtReliefAdapter = new DebtReliefAdapter();
const debtReliefUsecase = new CreateDebtReliefUsecase(debtReliefAdapter);
const findDebtReliefUsecase = new FindDebtReliefUsecase(debtReliefAdapter);
const deleteDebtReliefUsecase = new DeleteDebtReliefUseCase(debtReliefAdapter);
const simulateDebtReliefUsecase = new SimulateDebtReliefUsecase(debtReliefAdapter);

const debtController = new DebtReliefController(debtReliefUsecase, findDebtReliefUsecase, deleteDebtReliefUsecase, simulateDebtReliefUsecase);

routes.post('/debt-relief', debtController.createDebtRelief);
routes.get('/debt-relief/:creditCode', debtController.findDebtReliefs);
routes.delete('/debt-relief/:creditCode', debtController.deleteDebtRelief);
routes.post('/simulate/debt-reliefs', debtController.simulateDebtReliefs);

export default routes;