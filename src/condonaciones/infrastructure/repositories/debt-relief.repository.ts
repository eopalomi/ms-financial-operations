import { Pool } from "pg";
import { DebtWaiverRepository } from "../../domain/repositories/debt-waiver.repository";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import axios, { AxiosResponse } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { crearDbPostgresDatabase } from "../config/creardb.postgres";
import { creditPaymentInterfaceDTO } from "../DTO/pag_cuo.dto";


export class DebtReliefRepository implements DebtWaiverRepository {
   private readonly pool: Pool;

   constructor() {
      this.pool = crearDbPostgresDatabase.getConnection();
   }

   async save(debtWaiver: Partial<DebtRelief>): Promise<void> {
      const debtReliefProps = {
         creditCode: debtWaiver.creditCode,
         ammount: debtWaiver.ammount,
         numberPayment: debtWaiver.numberPayment,
         principalAmount: debtWaiver.principalAmount,
         interestAmount: debtWaiver.interestAmount,
         lateFeeAmount: debtWaiver.lateFeeAmount,
         collectionLocationCode: debtWaiver.collectionLocationCode,
         banckAccountCode: debtWaiver.banckAccountCode,
         paymentDate: debtWaiver.paymentDate,
         paymentHour: debtWaiver.paymentHour,
         paymentValueDate: debtWaiver.paymentValueDate,
         authorizationPersonCode: debtWaiver.authorizationPersonCode,
         authorizationPersondocumentCode: debtWaiver.authorizationPersondocumentCode
      };

      const creditPayment: creditPaymentInterfaceDTO = {
         cod_cre: debtWaiver.creditCode!,
         num_cuo: debtWaiver.numberPayment!,
         lug_rec: debtWaiver.collectionLocationCode!,
         num_ric: "99993",
         cod_int: "BG3213",
         fec_pag: String(debtWaiver.paymentDate),
         hor_pag: String(debtWaiver.paymentHour),
         fec_doc: String(debtWaiver.paymentValueDate),
         pago: debtWaiver.ammount!,
         pag_cap: debtWaiver.principalAmount!,
         pag_int: debtWaiver.interestAmount!,
         pag_seg: 0,
         pag_seg_desgra: 0,
         pag_mor: debtWaiver.lateFeeAmount!,
         pag_mor_mor: 0,
         pag_mor_com: 0,
         pag_itf: 0,
         pag_igv: 0,
         dia_int: 0,
         dia_mor: 0,
         cod_ubi: "109",
         tip_ope: "C",
         ult_pag: String(debtWaiver.paymentDate),
         cod_oei: "001",
         enc_cap: 0,
         enc_int: 0,
         enc_mor: 0,
         enc_mor_mor: 0,
         enc_mor_com: 0,
         enc_seg: 0,
         enc_seg_desgra: 0,
         cal_cap: 0,
         cal_int: 0,
         cal_rea: 0,
         cal_mor: 0,
         cal_imo: 0,
         cal_gas: 0,
         cap_por: 0,
         int_por: 0,
         cap_ven: 0,
         int_ven: 0,
         hor_rec: 0,
         vou_eess: 0,
         bru_eess: 0,
         itf_ent: 0,
         itf_sal: 0,
         rec_net: 0,
         com_cof: 0,
         net_tot: 0,
         cod_eess: 0,
         nom_eess: 0,
         swt_tip_pag: "0",
         fec_reg: "2023-07-06T19:37:52.088Z",
         hor_reg: "00:01",
         usu_reg: "PH008",
         fec_reg_pag: "2023-11-17",
         fec_pag_rea: "2023-11-17",
         tip_pagcuo: 0,
         swt_ser: 0,
         can_ant: 0,
         swt_can: "S",
         emp_tra: "",
         emp_ven: "",
         fue_fin_pag: "PR",
         mod_rea_pag: "CC",
         tip_amo_rop: "CN",
         fec_ven_pag: "2023-07-06",
         swt_mig_pag_ven: "I",
         dia_int_ec: 0,
         tip_cam: 0,
         mor_enc: 0,
         cue_ban: "",
         ori_tip_cam: "B",
         swt_pag_ban: "S",
         num_vou_ban: "abc12345",
         id_pagcre: 0,
         co_dispag: 0,
         fe_propre: "2023-07-09",
         pag_bol_int: 0,
         pag_seg_prev: 0
      };

      try {
         const { data, status } = await axios.post<void>(
            'http://localhost:3000/own-credit-payments',
            creditPayment, {
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            }
         });
      } catch (error: any) {
         console.log("Error: ", error.response)
         console.log("Error details : ", error.response.data.error.details)
         throw new Error(error)
      }
   }

   cancel(): Promise<void> {
      throw new Error("Method not implemented.");
   }

   async find(): Promise<DebtRelief> {
      const response = await axios.get<any>('http://[::1]:3000/own-payment-schedules?filter=%7B%0A%20%20%22offset%22%3A%200%2C%0A%20%20%22limit%22%3A%20100%2C%0A%20%20%22skip%22%3A%200%2C%0A%20%20%22order%22%3A%20%22num_cuo%22%2C%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22cod_cre%22%3A%20%22E1671001%22%0A%20%20%7D%2C%0A%20%20%22fields%22%3A%20%7B%0A%20%20%20%20%22cod_cre%22%3A%20true%2C%0A%20%20%20%20%22num_cuo%22%3A%20true%2C%0A%20%20%20%20%22capital%22%3A%20true%2C%0A%20%20%20%20%22interes%22%3A%20true%2C%0A%20%20%20%20%22cta_seg%22%3A%20true%2C%0A%20%20%20%20%22cta_seg_desgra%22%3A%20true%2C%0A%20%20%20%20%22cta_igv%22%3A%20true%2C%0A%20%20%20%20%22cta_seg_prev%22%3A%20true%2C%0A%20%20%20%20%22sal_cap%22%3A%20true%2C%0A%20%20%20%20%22sal_int%22%3A%20true%2C%0A%20%20%20%20%22sal_mor%22%3A%20true%2C%0A%20%20%20%20%22sal_seg%22%3A%20true%2C%0A%20%20%20%20%22sal_seg_desgra%22%3A%20true%2C%0A%20%20%20%20%22sal_seg_prev%22%3A%20true%2C%0A%20%20%20%20%22sal_igv%22%3A%20true%0A%20%20%7D%0A%7D')

      return response.data;
   }

   findAll(): Promise<DebtRelief[]> {
      throw new Error("Method not implemented.");
   }
}
