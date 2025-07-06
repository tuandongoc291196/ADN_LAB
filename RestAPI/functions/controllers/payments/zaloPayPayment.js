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

const processZaloPayRefund = async (paymentDetails, refundAmount) => {
  try {
    if (!paymentDetails) {
      throw new Error("Payment details are required for processing refund");  
    }

    console.log("Processing ZALOPAY refund for payment details:", paymentDetails);
    
    const payment = JSON.parse(paymentDetails);
    const zp_trans_id = payment.zp_trans_id;
    const amount = refundAmount;
    const description = "REFUND";

    if (!zp_trans_id || !amount) {
      throw new Error("zp_trans_id and amount are required for refund");
    }

    const app_id = zaloPay.app_id;
    const timestamp = Date.now();
    const transID = Math.floor(Math.random() * 1000000);
    const m_refund_id = `${moment().format('YYMMDD')}_${app_id}_${transID}`;

    const hmacinput = `${app_id}|${zp_trans_id}|${amount}|${description}|${timestamp}`;

    const mac = crypto.createHmac('sha256', zaloPay.key1)
        .update(hmacinput)
        .digest('hex');

    const requestBody = {
      app_id: app_id,
      m_refund_id: m_refund_id,
      zp_trans_id: zp_trans_id,
      amount: amount,
      timestamp: timestamp,
      description: description,
      mac: mac
    };

    const refundRequestBody = JSON.stringify(requestBody);

    const refundZALOPAYRequest = {
      method: "POST",
      url: "https://sb-openapi.zalopay.vn/v2/refund",
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(refundRequestBody),
      },
      data: refundRequestBody
    };

    console.log("Sending ZALOPAY refund request:", refundRequestBody);
    const result = await axios(refundZALOPAYRequest);
    
    console.log("ZALOPAY Refund Response:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error processing ZALOPAY refund:", error);
    throw error;
  }
};

module.exports = {
  processZaloPayPayment,
  getPaymentDataZALOPAY,
  processZaloPayRefund,
};
