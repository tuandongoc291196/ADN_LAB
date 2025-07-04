const { default: axios } = require('axios');
const zaloPay = require('../../config/zaloPay');
const crypto = require('crypto');
const moment = require('moment');

const processZaloPayPayment = async (totalAmount) => {
  try {
    const transID = Math.floor(Math.random() * 1000000);
    const app_id = zaloPay.app_id;
    const app_user = "user_" + Date.now();
    const app_time = Date.now();
    const app_partner = zaloPay.partnerCode;
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const items = [{}];
    const item = JSON.stringify(items);
    const embed_data = JSON.stringify(zaloPay.embed_data);
    const bank_code = zaloPay.bank_code;
    const description = `Payment for the order #${transID}`;
    
    const rawSignBodyPaymentZALOPAY = app_id + "|" + app_trans_id + "|" + app_user + "|" + totalAmount + "|" + app_time + "|" + embed_data + "|" + item;
    
    const signatureBodyPaymentZALOPAY = crypto.createHmac('sha256', zaloPay.key1)
        .update(rawSignBodyPaymentZALOPAY)
        .digest('hex');
    
    const requestBodyPaymentZALOPAY = JSON.stringify({
        app_id: app_id,
        app_trans_id: app_trans_id,
        app_user: app_user,
        app_time: app_time,
        amount: totalAmount,
        item: item,
        description: description,
        embed_data: embed_data,
        bank_code: bank_code,
        mac: signatureBodyPaymentZALOPAY
    });

    const paymentZALOPAYRequestBody = {
        method: "POST",
        url: "https://sb-openapi.zalopay.vn/v2/create",
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBodyPaymentZALOPAY),
        },
        data: requestBodyPaymentZALOPAY
    };

    const result = await axios(paymentZALOPAYRequestBody);
    return {
      ...result.data,
      app_trans_id: app_trans_id
    };
  } catch (error) {
    console.error("Error processing ZALOPAY payment:", error);
    throw error;
  }
};

const getPaymentDataZALOPAY = async (app_trans_id) => {
  try {
    console.log("Getting ZALOPAY payment data for", app_trans_id);
    const app_id = zaloPay.app_id;
    const rawSignatureBodyCheckZALOPAY = app_id + "|" + app_trans_id + "|" + zaloPay.key1;

    const signatureBodyCheckZALOPAY = crypto.createHmac('sha256', zaloPay.key1)
        .update(rawSignatureBodyCheckZALOPAY)
        .digest('hex');

    const requestBodyCheckZALOPAY = JSON.stringify({
        app_id: app_id,
        app_trans_id: app_trans_id,
        mac: signatureBodyCheckZALOPAY
    });

    console.log("Request body for ZALOPAY check:", requestBodyCheckZALOPAY);
    const paymentZALOCheckBody = {
        method: "POST",
        url: "https://sb-openapi.zalopay.vn/v2/query",
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBodyCheckZALOPAY),
        },
        data: requestBodyCheckZALOPAY
    };

    const response = await axios(paymentZALOCheckBody);
    const responseData = response.data;
    
    const extractedData = {
      return_code: responseData.return_code,
      return_message: responseData.return_message,
      sub_return_code: responseData.sub_return_code,
      sub_return_message: responseData.sub_return_message,
      is_processing: responseData.is_processing,
      amount: responseData.amount,
      zp_trans_id: responseData.zp_trans_id,
    };
    
    return extractedData;
  } catch (error) {
    console.error("Error getting ZALOPAY payment data:", error);
    throw error;
  }
};

const processVnpayRefund = async (paymentDetails) => {
  try {
    // VNPAY refund logic would go here
    return { success: true, message: "VNPAY refund processed successfully" };
  } catch (error) {
    console.error("Error processing VNPAY refund:", error);
    throw error;
  }
};

module.exports = {
  processZaloPayPayment,
  getPaymentDataZALOPAY,
};
