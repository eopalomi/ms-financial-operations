import dotenv from 'dotenv';
dotenv.config({ path: `.env.local` });

import request from 'supertest';
import express from 'express';
import app, {closeServer} from '../../app';
import  from './database/credit.database'

// const app = express();
app.use(express.json());


describe('Test Payment', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    
    test('GET endpoint /credit/debt-relief/:creditCode', async () => {

        creditList.forEach(async (credit) => {
            console.log("credit: ", credit)
            
            const getPayment = await request(app)
                .get(`/credit/debt-relief/${credit.creditCode}`)
                .send();

            
            expect(getPayment.statusCode).toBe(200);
            expect(getPayment.body.data.length).toBeGreaterThan(0);
        })

    });

    // test('PATCH endpoint /treasury/v1/payment/:id', async () => {
    //     const body = {
    //         idBank: 1,
    //         banckAccountNumber: "023123123123",
    //         interbankAccountNumber: "00332132132115245878",
    //         idBankForPayment: 13
    //     };

    //     const getPayment = await request(app)
    //         .patch("/treasury/v1/payment/137492")
    //         .send(body);

    //     expect(getPayment.statusCode).toBe(200);
    //     expect(getPayment.body.status).toEqual('00');
    // });

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    afterAll(()=> closeServer())
});