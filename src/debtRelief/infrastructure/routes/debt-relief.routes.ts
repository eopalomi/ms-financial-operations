import Express from 'express'
import { DebtReliefController } from '../controllers/debt-relief.controller';
import { DebtReliefRepositoryHTTP } from '../repositories/debt-relief.repository';
import { CreateDebtReliefUsecase } from '../../application/create-debt-relief.use-case';
import { DebtReliefService } from '../../application/services/debt-relief.service';
import { FindDebtReliefUsecase } from '../../application/find-debt-relief.use-case';
import { DeleteDebtReliefUseCase } from '../../application/delete-debt-relief.use-case';

const routes = Express.Router();

const debtReliedService = new DebtReliefService()
const debtReliefRepository = new DebtReliefRepositoryHTTP(debtReliedService);
const debtReliefUsecase = new CreateDebtReliefUsecase(debtReliefRepository);
const findDebtReliefUsecase = new FindDebtReliefUsecase(debtReliefRepository);
const deleteDebtReliefUsecase = new DeleteDebtReliefUseCase(debtReliefRepository);

const debtController = new DebtReliefController(debtReliefUsecase, findDebtReliefUsecase, deleteDebtReliefUsecase);

routes.post('/debt-relief', debtController.createDebtRelief);
routes.get('/debt-relief/:creditCode', debtController.findDebtReliefs);
routes.delete('/debt-relief/:creditCode', debtController.deleteDebtRelief);

export default routes;