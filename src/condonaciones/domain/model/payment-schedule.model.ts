export class PaymentShedule {
    public readonly creditCode: string;
    public readonly numberPayment: number;
    public readonly principal: number;
    public readonly interest: number;
    public readonly vehicleInsurance: number;
    public readonly lifeInsurance: number;
    public readonly igvInsurance: number;
    public readonly preventionInsurance: number;
    public readonly principalBalance: number;
    public readonly interestBalance: number;
    public readonly feesbalance: number;
    public readonly vehicleInsuranceBalance: number;
    public readonly lifeInsuranceBalance: number;
    public readonly igvInsuranceBalance: number;
    public readonly preventionInsuranceBalance: number;

    constructor(constructor: {
        creditCode: string
        numberPayment: number
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
        this.creditCode = constructor.creditCode;
        this.numberPayment = constructor.numberPayment;
        this.principal = constructor.principal;
        this.interest = constructor.interest;
        this.vehicleInsurance = constructor.vehicleInsurance;
        this.lifeInsurance = constructor.lifeInsurance;
        this.igvInsurance = constructor.igvInsurance;
        this.preventionInsurance = constructor.preventionInsurance;
        this.principalBalance = constructor.principalBalance;
        this.interestBalance = constructor.interestBalance;
        this.feesbalance = constructor.feesbalance;
        this.vehicleInsuranceBalance = constructor.vehicleInsuranceBalance;
        this.lifeInsuranceBalance = constructor.lifeInsuranceBalance;
        this.igvInsuranceBalance = constructor.igvInsuranceBalance;
        this.preventionInsuranceBalance = constructor.preventionInsuranceBalance;
    }
}