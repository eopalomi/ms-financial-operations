import { creditPaymentInterfaceDTO } from "../DTO/pag_cuo.dto";
import axios from 'axios';

export class PaymentService {
    public readonly lb4Host: string;
    
    constructor(){
        this.lb4Host = `${process.env.HOST_NAME_LB}:${process.env.PORT_LB}`;
    }

    public getReceiptCode = async (): Promise<string> => {
        const {data: response} = await axios.get(`${this.lb4Host}/receipt-number/C5/1`);
        return response.idReceipt;
    }

    public getIdPayment = async (): Promise<number> => {
        const {data: payment } = await axios.get(`${this.lb4Host}/payment-process`);

        return payment.id_pagcre;
    }

    public toPayment = (paymentData: {
        cod_cre: string,
        num_cuo: number,
        lug_rec: string,
        num_ric: string,
        cod_int: string,
        fec_pag: string,
        hor_pag: string,
        fec_doc: string,
        pago: number,
        pag_cap: number,
        pag_int: number,
        pag_seg: number,
        pag_seg_desgra: number,
        pag_mor: number,
        pag_itf: number,
        pag_igv: number,
        dia_mor: number,
        ult_pag: string | null,
        enc_cap: number,
        enc_int: number,
        enc_mor: number,
        enc_mor_mor: number,
        enc_mor_com: number,
        enc_seg: number,
        enc_seg_desgra: number,
        cal_cap: number,
        cal_int: number,
        cap_por: number,
        int_por: number,
        cap_ven: number,
        int_ven: number,
        fec_reg: string,
        hor_reg: string,
        usu_reg: string,
        fec_reg_pag: string,
        fec_pag_rea: string,
        tip_pagcuo: string | null,
        emp_tra: string,
        emp_ven: string,
        fue_fin_pag: string,
        fec_ven_pag: string,
        dia_int_ec: number,
        tip_cam: number,
        cue_ban: string | null,
        id_pagcre: number,
        fe_propre: string,
        pag_seg_prev: number
        cod_ds: number | null,
        usu_aut_con: string | null
     }): creditPaymentInterfaceDTO  => {
        const creditPayment: creditPaymentInterfaceDTO = {
            cod_cre: paymentData.cod_cre,
            num_cuo: paymentData.num_cuo,
            lug_rec: paymentData.lug_rec,
            num_ric: String(paymentData.num_ric),
            cod_int: String(paymentData.cod_int),
            fec_pag: String(paymentData.fec_pag),
            hor_pag: String(paymentData.hor_pag),
            fec_doc: String(paymentData.fec_doc),
            pago: paymentData.pago,
            pag_cap: paymentData.pag_cap,
            pag_int: paymentData.pag_int,
            pag_seg: paymentData.pag_seg,
            pag_seg_desgra: paymentData.pag_seg_desgra,
            pag_mor: paymentData.pag_mor,
            pag_mor_mor: 0.00,
            pag_mor_com: 0.00,
            pag_itf: paymentData.pag_itf,
            pag_igv: paymentData.pag_igv,
            dia_int: 0,
            dia_mor: paymentData.dia_mor,
            cod_ubi: "001",
            tip_ope: "C",
            ult_pag: paymentData.ult_pag ? String(paymentData.ult_pag) : null,
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
            cal_rea: 0.00,
            cal_mor: 0.00,
            cal_imo: 0.00,
            cal_gas: 0.00,
            cap_por: 0,
            int_por: 0,
            cap_ven: 0,
            int_ven: 0,
            hor_rec: null,
            vou_eess: null,
            bru_eess: null,
            itf_ent: null,
            itf_sal: null,
            rec_net: null,
            com_cof: null,
            net_tot: null,
            cod_eess: null,
            nom_eess: null,
            swt_tip_pag: "0",
            fec_reg: paymentData.fec_reg,
            hor_reg: paymentData.hor_reg,
            usu_reg: "PH008",
            fec_reg_pag: paymentData.fec_reg_pag,
            fec_pag_rea: paymentData.fec_reg_pag,
            tip_pagcuo:  paymentData.tip_pagcuo,
            swt_ser: "0",
            can_ant: null,
            swt_can: null,
            emp_tra: paymentData.emp_tra,
            emp_ven: paymentData.emp_ven,
            fue_fin_pag: paymentData.fue_fin_pag,
            mod_rea_pag: "PC",
            tip_amo_rop: "CN",
            fec_ven_pag: paymentData.fec_ven_pag,
            swt_mig_pag_ven: "I",
            dia_int_ec: 0,
            tip_cam: 1.00,
            mor_enc: 0.00,
            cue_ban: null,
            ori_tip_cam: "B",
            swt_pag_ban: null,
            num_vou_ban: null,
            id_pagcre: paymentData.id_pagcre,
            co_dispag: 0,
            fe_propre: paymentData.fe_propre,
            pag_bol_int: 0.00,
            pag_seg_prev: 0,
            cod_ds: paymentData.cod_ds,
            usu_aut_con: paymentData.usu_aut_con
         };
    
        return creditPayment;
    };
}