const { ProductCode, VnpLocale, getDateInGMT7, dateFormat} = require('vnpay');
const { vnpay, redirectUrl} = require('../../config/vnPay');
const { randomAlphanumeric } = require('../utils/utilities');
const axios = require('axios');

const getClientIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json', { timeout: 3000 });
    return response.data.ip;
  } catch (error) {
    console.warn('Failed to get external IP, using localhost:', error.message);
    return '127.0.0.1';
  }
};

const processVnpayPayment = async (totalAmount, paymentId) => {
  try {
    const valueURL = paymentId;
    const returnUrl = redirectUrl;
    const logsMakeVNPAY = [];


    const createDate = new Date();
    const expireDate = new Date(createDate.getTime() + 60 * 60 * 1000); // Add 15 minutes
    const vnp_IpAddr = await getClientIP()
    console.log("Client IP Address:", vnp_IpAddr);
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: totalAmount,
        vnp_IpAddr: '13.160.92.202',
        vnp_TxnRef: valueURL,
        vnp_OrderInfo: `Payment for order ${valueURL}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: returnUrl,
        vnp_Locale: VnpLocale.VN,
        vnp_BankCode: 'NCB',
        vnp_CreateDate: dateFormat(new Date()), 
        vnp_ExpireDate: dateFormat(new Date(createDate.getTime() + 24 * 60 * 60 * 1000)),
    });

    return {
      paymentUrl,
      logsMakeVNPAY
    };
  } catch (error) {
    console.error("Error processing VNPAY payment:", error);
    throw error;
  }
};

const getPaymentDataVNPAY = async (logsMakeVNPAY) => {
  try {
    const vnp_IpAddr = [...new Set(logsMakeVNPAY.map(log => log.vnp_IpAddr))].join(', ');
    const vnp_TxnRef = [...new Set(logsMakeVNPAY.map(log => log.vnp_TxnRef))].join(', ');
    const vnp_TransactionDate = [...new Set(logsMakeVNPAY.map(log => log.vnp_CreateDate))].join(', ');
    const vnp_CreateDate = dateFormat(getDateInGMT7(new Date()));
    
    console.log(vnp_IpAddr);
    console.log(vnp_TxnRef);
    console.log(vnp_TransactionDate);
    console.log(vnp_CreateDate);
    
    const PaymentDataVNPAY = await vnpay.queryDr({
      vnp_RequestId: await randomAlphanumeric(16, 16),
      vnp_IpAddr: vnp_IpAddr,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: 'Thanh toan don hang',
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
    });
    
    return PaymentDataVNPAY;
  } catch (error) {
    console.error("Error getting VNPAY payment data:", error);
    throw error;
  }
};

const checkPaymentVNPAY = async (paymentDataVNPAY) => { 
  try {
    return paymentDataVNPAY.isSuccess == true;
  } catch (error) {
    console.error("Error checking VNPAY payment status:", error);
    throw error;
  }
};

module.exports = {
  processVnpayPayment,
  getPaymentDataVNPAY,
  checkPaymentVNPAY
};
