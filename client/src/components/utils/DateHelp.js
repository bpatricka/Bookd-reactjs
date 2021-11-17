
export function addHours(date, hours){
    let result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}

export function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result
}
  
export function addMinutes(date, minutes) {
    let result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result
}

export function subHours(date, hours) {
    let result = new Date(date);
    result.setHours(result.getHours() - hours);
    return result;
}
  
// date formatting for mssql format
export function formatDate(date){
    let df = "YYYY-MM-DD hh:mm:ss.mmm";

    df = df.replace("DD", date.getDate());
    df = df.replace("MM", date.getMonth()+1);
    df = df.replace("YYYY", date.getFullYear());
    df = df.replace("hh", date.getHours());
    df = df.replace("mm", date.getMinutes());
    df = df.replace("ss", date.getSeconds());
    df = df.replace("mmm", date.getMilliseconds());
    return df;
}