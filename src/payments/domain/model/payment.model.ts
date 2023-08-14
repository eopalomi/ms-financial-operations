import { debtReliefException } from "../../shared/exceptions/debt-relief.exceptions";

export abstract class Payments {
    public readonly creditCode: string;
    public readonly amount: number;
    public readonly numberPayment: number;
    public readonly principalAmount: number;
    public readonly interestAmount: number;
    public readonly lateFeeAmount: number;
    public readonly vehicleInsurance: number;
    public readonly lifeInsurance: number;
    public readonly igvInsurance: number;
    public readonly preventionInsurance: number;
    public readonly collectionLocationCode: string;
    public readonly paymentType: string | null;
    public readonly banckAccountCode: string | null;
    public readonly paymentDate: string;
    public readonly paymentHour: string;
    public readonly paymentValueDate: string;
    public readonly registeringPersonCode: string;
    private _idPayment: number | null;

    constructor(constructor: {
        creditCode: string,
        amount: number,
        numberPayment: number,
        principalAmount: number,
        interestAmount: number,
        lateFeeAmount: number,
        vehicleInsurance: number,
        lifeInsurance: number,
        igvInsurance: number,
        preventionInsurance: number,
        collectionLocationCode: string,
        paymentType: string | null,
        banckAccountCode: string | null,
        paymentDate: string,
        paymentHour: string,
        paymentValueDate: string,
        registeringPersonCode: string,
        _idPayment: number | null
    }) {
        this.creditCode = constructor.creditCode;
        this.amount = constructor.amount;
        this.numberPayment = constructor.numberPayment;
        this.principalAmount = constructor.principalAmount;
        this.interestAmount = constructor.interestAmount;
        this.lateFeeAmount = constructor.lateFeeAmount;
        this.vehicleInsurance = constructor.vehicleInsurance;
        this.lifeInsurance = constructor.lifeInsurance;
        this.igvInsurance = constructor.igvInsurance;
        this.preventionInsurance = constructor.preventionInsurance;
        this.collectionLocationCode = constructor.collectionLocationCode;
        this.paymentType = constructor.paymentType;
        this.banckAccountCode = constructor.banckAccountCode;
        this.paymentHour = constructor.paymentHour;
        this.paymentDate = constructor.paymentDate;
        this.paymentValueDate = constructor.paymentValueDate;
        this.registeringPersonCode = constructor.registeringPersonCode;
        this._idPayment = constructor._idPayment;

        this.validate();
    }

    set idPayment(idPayment: number | null) {
        this._idPayment = idPayment;
    }

    validate() {
        const regexValHour = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const regexValDate = /^\d{4}-\d{2}-\d{2}$/;

        if (!regexValHour.test(this.paymentHour)) {
            throw new debtReliefException('invalidFormatPaymentHour', 'Invalid format payment Hour');
        }

        if (!regexValDate.test(this.paymentDate)) {
            throw new debtReliefException('invalidFormatPaymentDate', 'Invalid format payment date');
        }

        if (!regexValDate.test(this.paymentValueDate)) {
            throw new debtReliefException('invalidFormatPaymentValueDate', 'Invalid format payment value date');
        }
    }

}

