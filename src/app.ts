import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express from 'express';
import debtReliefRoutes from './payments/infrastructure/routes/debt-relief.routes';
import paymentScheduleRoutes from './payment-schedule/infrastructure/routes/payment-schedule.routes';

const app = express();

app.use(express.json());
app.use('/credit', debtReliefRoutes);
app.use('/credit', paymentScheduleRoutes);

const port = process.env.PORT || 1212;

const server = app.listen(port, () => {
   console.log(`Servidor corriendo en el puerto ${port}`);
});

export default app;

export const closeServer = () => {
   server.close();
};