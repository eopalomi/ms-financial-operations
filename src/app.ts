import express from 'express';
import dotenv from 'dotenv';
import debtReliefRoutes from './debtRelief/infrastructure/routes/debt-relief.routes';
import paymentScheduleRoutes from './paymentSchedule/infrastructure/routes/payment-schedule.routes';

const app = express();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const port = process.env.PORT || 1212;

app.use(express.json());
app.use('/credit', debtReliefRoutes);
app.use('/credit', paymentScheduleRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
