export class PaymentCanceled {
    public readonly codigo: number;
    public readonly personCode: string;
    public readonly cancellationDate: string;
    public readonly ip: string;

    constructor(constructor: {
        codigo: number
        personCode: string
        cancellationDate: string
        ip: string
    }) {
        this.codigo = constructor.codigo
        this.personCode = constructor.personCode
        this.cancellationDate = constructor.cancellationDate
        this.ip = constructor.ip
    };
};