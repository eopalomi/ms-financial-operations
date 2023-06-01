
export class DebtWaiver {
    public readonly creditCode: string;
    public readonly ammount: number;
    public readonly numberPayment: number;
    public readonly principalAmount: number;
    public readonly interestAmount: number;
    public readonly lateFeeAmount: number;

    public constructor(constructor: {
        creditCode: string;
        ammount: number,
        numberPayment: number,
        principalAmount: number,
        interestAmount: number,
        lateFeeAmount: number
    }) {
        this.creditCode = constructor.creditCode;
        this.ammount = constructor.ammount;
        this.numberPayment = constructor.numberPayment;
        this.principalAmount = constructor.principalAmount;
        this.interestAmount = constructor.interestAmount;
        this.lateFeeAmount = constructor.lateFeeAmount;
    }
}