const {VNPay} = require('vnpay');

let vnpay;

try {
    vnpay = new VNPay({
        tmnCode: 'B327N5YI',
        secureSecret: 'W0TQRIZJFDE9X6C4ZSVBKS7VOFIKFLSL',
        vnpayHost: ' https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        testMode: true,
        hashAlgorithm: 'SHA512', 
        enableLog: true,
    });
} catch (error) {
    console.error("Error initializing VNPay configuration:", error);
    throw new Error("Failed to initialize VNPay configuration");
}

module.exports = {vnpay};