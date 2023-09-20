import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import request from 'supertest';
import app, {closeServer} from '../../app';

const body = {
   creditCode: 'G0178244',
   amount: 1.00,
   numberPayment: 15,
   principalAmount: 1.00,
   interestAmount: 0.00,
   lateFeeAmount: 0.00,
   vehicleInsurance: 0.00,
   lifeInsurance: 0.00,
   igvInsurance: 0.00,
   preventionInsurance: 0.00,
   collectionLocationCode: 'C5',
   paymentType: null,
   paymentDate: '2023-07-06',
   paymentHour: '15:00:00 PM',
   paymentValueDate: '2023-07-06',
   authorizationPersonCode: 'PH008',
   requestingPersonCode: 'PH008',
   registeringPersonCode: 'PH008',
   idDocumentWF: 312
};

let postResponse: request.Response;

describe('POST /credit/debt-relief', () => {
   beforeAll(async()=>{
      postResponse = await request(app).post('/credit/debt-relief').send(body);
   });
   
   test('should have 200 status code', async () => {   
      expect(postResponse.statusCode).toBe(200);
   });

   test('should have a data propertie with values', async () => {
      expect(postResponse.body.data).not.toBeNull();
      expect(postResponse.body.data).not.toBeUndefined();
   });

   test('should have a response code 00', async () => {
      expect(postResponse.body.code).toBe('00');
   });
});

describe('GET /credit/debt-relief', () => {
   let response: request.Response;

   beforeAll(async()=>{
      response = await request(app).get('/credit/debt-relief/G0178244').send();
   });
   
   test('should have 200 status code', async () => {   
      expect(response.statusCode).toBe(200);
   });

   test('should have a data propertie with values', async () => {
      expect(response.body.data).not.toBeNull();
      expect(response.body.data).not.toBeUndefined();
   });

   test('should have a response code 00', async () => {
      expect(response.body.code).toBe('00');
   });
});

describe('DELETE /credit/debt-relief', () => {
   let response: request.Response;

   beforeAll(async()=>{
      response = await request(app).delete('/credit/debt-relief/G0178244').send({
         idPayment: +postResponse.body.data._idPayment,
         personCode: 'PH008',
         ip: '0.0.0.1'
      });
   });
   
   test('should have 204 status code', async () => {   
      expect(response.statusCode).toBe(204);
   });

   test('should not have body response with values', async () => {
      expect(response.body).toEqual({});
   });
});

afterAll(()=> closeServer())
