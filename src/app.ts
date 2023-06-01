import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const port = process.env.PORT || 1212;

app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
