export class Installment {

   public readonly numberPayment: number;
   public readonly paymentDate: string;
   public readonly principal: number;
   public readonly interest: number;
   public readonly vehicleInsurance: number;
   public readonly lifeInsurance: number;
   public readonly igvInsurance: number;
   public readonly preventionInsurance: number;
   public principalBalance: number;
   public interestBalance: number;
   public feesbalance: number;
   public vehicleInsuranceBalance: number;
   public lifeInsuranceBalance: number;
   public igvInsuranceBalance: number;
   public preventionInsuranceBalance: number;

   constructor(constructor: {
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
      this.numberPayment = constructor.numberPayment;
      this.paymentDate = constructor.paymentDate;
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