const { default: axios } = require('axios');
const momo = require('../../config/momo');
const crypto = require('crypto');

const processMomoPayment = async (totalAmount, paymentId) => {
  try {
    const accessKey = momo.accessKey;
    const secretKey = momo.secretKey;
    const orderInfo = momo.orderInfo;
    const partnerCode = momo.partnerCode;
    const redirectUrl = momo.redirectUrl;
    const ipnUrl = momo.ipnUrl;
    const requestType = momo.requestType;
    const amount = totalAmount;
    const orderId = paymentId;
    const requestId = paymentId;
    const extraData = momo.extraData;
    const orderGroupId = momo.orderGroupId;
    const autoCapture = momo.autoCapture;
    const orderExpireTime = momo.orderExpireTime;
    const lang = momo.lang;

    const rawSignBodyPaymentMOMO = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" +
      extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl +
      "&requestId=" + requestId + "&requestType=" + requestType;

    const signatureBodyPaymentMOMO = crypto.createHmac('sha256', secretKey)
      .update(rawSignBodyPaymentMOMO)
      .digest('hex');
    const requestBodyPaymentMOMO = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      orderExpireTime: orderExpireTime,
      signature: signatureBodyPaymentMOMO
    });

    const paymentMOMORequestBody = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBodyPaymentMOMO),
      },
      data: requestBodyPaymentMOMO
    };

    console.log("MOMO Payment Request Body:", paymentMOMORequestBody);

    const result = await axios(paymentMOMORequestBody);
    return result.data;
  } catch (error) {
    console.error("Error processing MOMO payment:", error);
    throw error;
  }
};

const getPaymentDataMOMO = async (orderId, requestId) => {
  try {
    const accessKey = momo.accessKey;
    const secretKey = momo.secretKey;
    const partnerCode = momo.partnerCode;

    const rawSignatureBodyCheckMOMO = "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId;

    const signatureBodyCheckMOMO = crypto.createHmac('sha256', secretKey)
      .update(rawSignatureBodyCheckMOMO)
      .digest('hex');

    const requestBodyCheckMOMO = JSON.stringify({
      partnerCode: partnerCode,
      requestId: requestId,
      orderId: orderId,
      signature: signatureBodyCheckMOMO,
      lang: "en"
    });

    const paymentMOMOCheckBody = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBodyCheckMOMO),
      },
      data: requestBodyCheckMOMO
    };

    const response = await axios(paymentMOMOCheckBody);
    const responseData = response.data;

    const extractedData = {
      partnerCode: responseData.partnerCode,
      orderId: responseData.orderId,
      requestId: responseData.requestId,
      amount: responseData.amount,
      transId: responseData.transId,
      responseTime: responseData.responseTime,
      message: responseData.message,
      resultCode: responseData.resultCode,
    };

    return extractedData;
  } catch (error) {
    console.error("Error getting MOMO payment data:", error);
    throw error;
  }
};

const processMomoRefund = async (paymentDetails, refundAmount) => {
  try {
    console.log("Processing MOMO refund for payment details:", paymentDetails);
    const payment = JSON.parse(paymentDetails);
    const accessKey = momo.accessKey;
    const secretKey = momo.secretKey;
    const partnerCode = payment.partnerCode;
    const orderId = `${payment.orderId}_REFUND`;
    const requestId = `${payment.orderId}_REFUND`;
    const transId = payment.transId;
    const amount = refundAmount;
    const lang = "en";
    const description = "REFUND";

    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&description=" + description
      + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId + "&transId=" + transId;
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBodyPayment = JSON.stringify({
      partnerCode: partnerCode,
      orderId: orderId,
      requestId: requestId,
      amount: amount,
      transId: transId,
      lang: lang,
      description: description,
      signature: signature,
    });

    console.log("MOMO Refund Request Body:", requestBodyPayment);
    const paymentRequestBody = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/refund",
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBodyPayment),
      },
      data: requestBodyPayment
    }

    let result;
    result = await axios(paymentRequestBody);
    console.log("MOMO Refund Response:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error processing MOMO refund:", error);
    throw error;
  }
};

module.exports = {
  processMomoPayment,
  getPaymentDataMOMO,
  processMomoRefund
};
