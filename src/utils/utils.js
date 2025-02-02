export const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}

export const getPreviousMonthDate = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1 - 1);
    return currentDate;
}

export const getDataFlow = (number) =>{
    return parseInt(number) > 0 ? "increase" : (parseInt(number) === 0 ? "constant" : "decrease")
}


export const getDataFlowColorClassName = (number,mode = "normal") =>{
switch(mode){
    case "normal":
        return parseInt(number) > 0 ? "increase-text" : (parseInt(number) === 0 ? "constant-text" : "decrease-text");
    default:
        return parseInt(number) < 0 ? "increase-text" : (parseInt(number) === 0 ? "constant-text" : "decrease-text");
}
}


export const handleResponse = async (response) => {
    try {
        let jsonData = await response.json();

        if(jsonData.code === 200){
            return jsonData.result;
        }else{
            console.group("Response warnings");
            console.warn(`Response status: ${response.status}`);
            console.warn(`Response code: ${response.code}`);
            console.warn(`Response message: ${response.message}`);
            console.groupEnd();
            return [];
        }   
    } catch (error) {
        console.error(`Fired from handleResponse: ${error}`);
        return [];
    }
} 


export const shallowObjComparison = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => obj1[key] === obj2[key]);
};

export const getMexicoDate = (date) => {
    return new Date(Number(date)).toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' })
}

export const formatTimestampToDate = (timestamp, format="MM/DD/YYYY") => {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    } else if (format === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
    } else {
        throw new Error('Unsupported format. Use "YYYY-MM-DD" or "MM/DD/YYYY".');
    }
}

export const capitalize = (word) => {
    return word.replace(word[0], word[0].toUpperCase())
}

export const calculateAverageXi = (dataArray) => {
    const xiValues = dataArray.map(item => item.xi);
    const sum = xiValues.reduce((total, value) => total + Number(value), 0);
    const average = sum / dataArray.length;

    return average;
};