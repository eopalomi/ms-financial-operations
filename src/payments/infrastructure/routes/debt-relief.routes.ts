import Express from 'express'
import { DebtReliefController } from '../controllers/debt-relief.controller';
import { DebtReliefAdapter } from '../adapters/debt-relief.adapter';
import { CreateDebtReliefUsecase } from '../../application/debt-relief/create-debt-relief.use-case';
import { DebtReliefService } from '../../application/services/debt-relief.service';
import { FindDebtReliefUsecase } from '../../application/debt-relief/find-debt-relief.use-case';
import { DeleteDebtReliefUseCase } from '../../application/debt-relief/delete-debt-relief.use-case';
import { SimulateDebtReliefUsecase } from '../../application/debt-relief/simulate-debt-relief.use-case';

const routes = Express.Router();

const debtReliedService = new DebtReliefService()
const debtReliefRepository = new DebtReliefAdapter(debtReliedService);
const debtReliefUsecase = new CreateDebtReliefUsecase(debtReliefRepository);
const findDebtReliefUsecase = new FindDebtReliefUsecase(debtReliefRepository);
const deleteDebtReliefUsecase = new DeleteDebtReliefUseCase(debtReliefRepository);
const simulateDebtReliefUsecase = new SimulateDebtReliefUsecase();

const debtController = new DebtReliefController(debtReliefUsecase, findDebtReliefUsecase, deleteDebtReliefUsecase, simulateDebtReliefUsecase);

routes.post('/debt-relief', debtController.createDebtRelief);
routes.get('/debt-relief/:creditCode', debtController.findDebtReliefs);
routes.delete('/debt-relief/:creditCode', debtController.deleteDebtRelief);

routes.post('/simulate/debt-reliefs', debtController.simulateDebtReliefs);

export default routes;