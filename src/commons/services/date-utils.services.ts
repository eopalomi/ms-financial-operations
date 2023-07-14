type DateFormats = 'yyyy-mm-dd' | 'YYYY-MM-DD_hhmmss' | 'hh:mm';

export const formatedDate = (date: Date, dateFormats: DateFormats): string  => {

    if(!dateFormats){
        throw new Error("Function formatedDate requeri dateFormats arg");        
    };

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDay().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minuts = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const miliseconds = date.getMilliseconds().toString().padStart(3, '0');
    
    if (dateFormats === "YYYY-MM-DD_hhmmss") {
        return `${year}-${month}-${day} ${hour}:${minuts}:${seconds}.${miliseconds}`;
    };

    if (dateFormats === "yyyy-mm-dd") {
        return `${year}-${month}-${day}`;
    }

    if (dateFormats === "hh:mm") {
        return `${hour}:${minuts}`;
    }

    return `${year}-${month}-${day}`;
};