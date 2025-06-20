async function randomAlphanumeric(minLength = 1, maxLength = 100) {
    if (minLength < 1 || maxLength > 100 || minLength > maxLength) {
        throw new Error("Invalid length range. minLength must be between 1 and 100 (inclusive) and less than or equal to maxLength.");
    } 
    const alphanumeric = "0123456789";
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    let result = "";
    for (let i = 0; i < length; i++) {
        result += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    
    return result;
}

function randomAlphanumericWithLength(length) {
    if (length < 1 || length > 100) {
        throw new Error("Length must be between 1 and 100 (inclusive).");
    }
    const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    
    let result = "";
    for (let i = 0; i < length; i++) {
        result += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    
    return result;
}

async function getDateYYMMDD() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function generateOrderId(partnerCode) {
  return partnerCode + new Date().getTime();
}

function generateRequestId(partnerCode) {
  return generateOrderId(partnerCode);
}

module.exports = {
    randomAlphanumeric,
    getDateYYMMDD,
    generateOrderId,
    generateRequestId,
    randomAlphanumericWithLength
};