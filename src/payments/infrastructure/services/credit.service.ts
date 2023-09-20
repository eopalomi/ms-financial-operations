import axios from 'axios';

type CreditInfoResponse = {
   cod_cre: string;
   emp_ven: string;
   emp_tra: string;
   ult_pag: string;
   fue_fin: string;
   ide_coo: string;
   cod_exp: string;
   cod_int: string;
   il_admacc: boolean;
   paymentPath:  string;
   cancelPaymentPath:  string;
   schedulesPath:  string;
};

export class CreditService {
   lb4Host: string;

   constructor(){
      this.lb4Host = `${process.env.HOST_NAME_LB}:${process.env.PORT_LB}`;
   }

   getCreditInformation = async (creditCode: string): Promise<CreditInfoResponse> => {
      const { data: creditInfo } = await axios.get<CreditInfoResponse>(`${this.lb4Host}/credit-information/${creditCode}`);

      const paymentPath = creditInfo.il_admacc === true ? 'own-credit-payments' : 'transferred-credit-payments';
      const cancelPaymentPath = creditInfo.il_admacc === true ? 'own-payment-canceled' : 'transferred-payment-canceled';
      const schedulesPath = creditInfo.il_admacc === true ? 'own-payment-schedules' : 'transferred-payment-schedules';
        
      return {...creditInfo, paymentPath, cancelPaymentPath, schedulesPath };
   };
}