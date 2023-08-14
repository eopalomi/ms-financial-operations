type debtReliefErrorTypes =
    | 'default'
    | 'invalidFormatPaymentHour'
    | 'invalidFormatPaymentDate'
    | 'invalidFormatPaymentValueDate'
    | 'creditCodeEmpty'
    | 'idPaymentIsEmpty'
    | 'paymentNumberQuotaNotFound'
    | 'invalidArrayBodyRequest'
    | 'amountGreaterBalance';

const exceptionsFactory = () => {
    return class customExceptionsFactory extends Error {
        public readonly errorType: debtReliefErrorTypes;

        constructor(errorType: debtReliefErrorTypes, message: string) {
            super(message);

            this.errorType = errorType;
        }
    }
};

export const debtReliefException = exceptionsFactory();
