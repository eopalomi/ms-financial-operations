import { PaymentInstallment } from "./payment-installment.model";

export class PaymentShedule {
    public readonly creditCode: string;
    public readonly paymentInstallment: PaymentInstallment[] = [];

    constructor(constructor: {
        creditCode: string
    }) {
        this.creditCode = constructor.creditCode;
    }

    addInstallmentNumber(data: {
        numberPayment: number
        paymentDate: string
        principal: number
        interest: number
        vehicleInsurance: number
        lifeInsurance: number
        igvInsurance: number
        preventionInsurance: number
        principalBalance: number
        interestBalance: number
        feesbalance: number
        vehicleInsuranceBalance: number
        lifeInsuranceBalance: number
        igvInsuranceBalance: number
        preventionInsuranceBalance: number
    }) {
        const installmentNumber = new PaymentInstallment({
            numberPayment: data.numberPayment,
            paymentDate: data.paymentDate,
            principal: data.principal,
            interest: data.interest,
            vehicleInsurance: data.vehicleInsurance,
            lifeInsurance: data.lifeInsurance,
            igvInsurance: data.igvInsurance,
            preventionInsurance: data.preventionInsurance,
            principalBalance: data.principalBalance,
            interestBalance: data.interestBalance,
            feesbalance: data.feesbalance,
            vehicleInsuranceBalance: data.vehicleInsuranceBalance,
            lifeInsuranceBalance: data.lifeInsuranceBalance,
            igvInsuranceBalance: data.igvInsuranceBalance,
            preventionInsuranceBalance: data.preventionInsuranceBalance
        });

        this.paymentInstallment.push(installmentNumber)
    }

}