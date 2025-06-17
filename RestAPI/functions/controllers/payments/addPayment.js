/**
 * @fileoverview Payment controller for handling MOMO, VNPAY, and ZALOPAY payments
 * @description This module provides functionality to create payment URLs for different payment providers
 */

const  {default: axios} = require('axios');
const { ProductCode, VnpLocale, getDateInGMT7, dateFormat} = require('vnpay');
const { vnpay } = require('../../config/vnPay');
const momo = require('../../config/momo');
const zaloPay = require('../../config/zaloPay');
const crypto = require('crypto');
const moment = require('moment');
const { randomAlphanumeric, generateOrderId, generateRequestId } = require('../utils/utilities');

/**
 * @swagger
 * components:
 *   examples:
 *     MomoPaymentExample:
 *       summary: MoMo payment request
 *       value:
 *         totalAmount: 50000
 *         paymentChoice: "MOMO"
 *     VnpayPaymentExample:
 *       summary: VNPay payment request
 *       value:
 *         totalAmount: 100000
 *         paymentChoice: "VNPAY"
 *     ZalopayPaymentExample:
 *       summary: ZaloPay payment request
 *       value:
 *         totalAmount: 75000
 *         paymentChoice: "ZALOPAY"
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a new payment
 *     description: Creates a payment URL for MOMO, VNPAY, or ZALOPAY payment methods
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *           examples:
 *             MoMo:
 *               $ref: '#/components/examples/MomoPaymentExample'
 *             VNPay:
 *               $ref: '#/components/examples/VnpayPaymentExample'
 *             ZaloPay:
 *               $ref: '#/components/examples/ZalopayPaymentExample'
 *     responses:
 *       200:
 *         description: Payment URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * Creates a payment URL for the specified payment method
 * 
 * @async
 * @function addPayment
 * @description Processes payment requests and generates payment URLs for MOMO, VNPAY, or ZALOPAY
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {number} req.body.totalAmount - Payment amount in VND (minimum 1,000)
 * @param {string} req.body.paymentChoice - Payment method: "MOMO", "VNPAY", or "ZALOPAY"
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns payment URL or error response
 * 
 * @example
 * // Request body for MOMO payment
 * {
 *   "totalAmount": 50000,
 *   "paymentChoice": "MOMO"
 * }
 * 
 * @example
 * // Successful response
 * {
 *   "statusCode": 200,
 *   "payUrl": "https://test-payment.momo.vn/v2/gateway/pay?..."
 * }
 */
module.exports.addPayment = async (req, res) => {
    const {totalAmount, paymentChoice} = req.body;

    if (!totalAmount) {
      return res.status(400).json({
        statusCode: 400,
        message: "totalAmount is required"
      })
    }

    if (!paymentChoice) {
      return res.status(400).json({
        statusCode: 400,
        message: "paymentChoice is required"
      })
    }

    //MOMO
    const accessKey = momo.accessKey;
    const secretKey = momo.secretKey;
    const orderInfo = momo.orderInfo;
    const partnerCode = momo.partnerCode;
    const redirectUrl = momo.redirectUrl;
    const ipnUrl = momo.ipnUrl;
    const requestType = momo.requestType;
    const amount = totalAmount;
    const orderId = generateOrderId(momo.partnerCode);
    const requestId = generateRequestId(momo.partnerCode);
    const extraData = momo.extraData;
    const orderGroupId = momo.orderGroupId;
    const autoCapture = momo.autoCapture;
    const orderExpireTime = momo.orderExpireTime;
    const lang = momo.lang;

    const rawSignBodyPaymentMOMO = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + 
    extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + 
    "&requestId=" + requestId + "&requestType=" + requestType;
    
    const rawSignatureBodyCheckMOMO = "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId;
    
    const signatureBodyPaymentMOMO = crypto.createHmac('sha256', secretKey)
        .update(rawSignBodyPaymentMOMO)
        .digest('hex');
    
    const signatureBodyCheckMOMO = crypto.createHmac('sha256', secretKey)
        .update(rawSignatureBodyCheckMOMO)
        .digest('hex');

    const requestBodyPaymentMOMO = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        orderExpireTime : orderExpireTime,
        signature : signatureBodyPaymentMOMO
    });

    const requestBodyCheckMOMO = JSON.stringify({
      partnerCode : partnerCode,
      requestId : requestId,
      orderId : orderId,
      signature : signatureBodyCheckMOMO,
      lang : "en"
    })

    const paymentMOMORequestBody = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBodyPaymentMOMO),
        },
        data: requestBodyPaymentMOMO
    }

    const paymentMOMOCheckBody = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBodyCheckMOMO),
      },
      data: requestBodyCheckMOMO
    }

    async function getPaymentDataMOMO(paymentCheckBody) {
      try {
        const response = await axios (paymentCheckBody);
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
        console.error(error);
      }
    }

    async function checkPaymentMOMO(extractedData) {
        return extractedData.resultCode == 0;
    }
    
    // VNPAY
    const vauleURL = "VNPAY" + await randomAlphanumeric(10, 10);
    const returnUrl = redirectUrl;

    async function paymentVNPAYRequestBody() {
      const paymentUrl = vnpay.buildPaymentUrl(
        {
          vnp_Amount: totalAmount,
          vnp_IpAddr:
              req.headers['x-forwarded-for'] ||
              req.connection.remoteAddress ||
              req.socket.remoteAddress ||
              req.ip,
          vnp_TxnRef: vauleURL,
          vnp_OrderInfo: vauleURL,
          vnp_OrderType: ProductCode.Other,
          vnp_ReturnUrl: returnUrl,
          vnp_Locale: VnpLocale.EN,
        },
        {
          logger: {
            type: 'all',
            loggerFn: (data) => savelog(data),
          },
        });     
        return paymentUrl;
    }

    async function getPaymentDataVNPAY(logsMakeVNPAY) {
      var vnp_IpAddr          = [...new Set(logsMakeVNPAY.map(log => log.vnp_IpAddr))].join(', ');
      var vnp_TxnRef          = [...new Set(logsMakeVNPAY.map(log => log.vnp_TxnRef))].join(', ');
      var vnp_TransactionDate = [...new Set(logsMakeVNPAY.map(log => log.vnp_CreateDate))].join(', ');
      var vnp_CreateDate      = dateFormat(getDateInGMT7(new Date()))
      
      console.log(vnp_IpAddr);
      console.log(vnp_TxnRef);
      console.log(vnp_TransactionDate)
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
    }

    async function checkPaymentVNPAY(paymentDataVNPAY) {
      return paymentDataVNPAY.isSuccess == true;
    }

    const logsMakeVNPAY = [];
    const logsPaymentVNPAY = [];

    async function savelog(data) {
      logsMakeVNPAY.push(data);
      console.log(data);
    }

    async function savelogMakeVNPAY(data) {
      logsPaymentVNPAY.push(data);
      console.log(data);
    }

    // ZALOPAY
    const transID = Math.floor(Math.random() * 1000000);
    const app_id = zaloPay.app_id;
    const app_user = "user_" + Date.now(); // Generate a user ID
    const app_time = Date.now();
    const app_partner = zaloPay.partnerCode;
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const items = [{}];
    const item = JSON.stringify(items);
    const embed_data = JSON.stringify(zaloPay.embed_data);
    const bank_code = zaloPay.bank_code;
    const description = `Payment for the order #${transID}`;
    
    const rawSignBodyPaymentZALOPAY = app_id + "|" + app_trans_id + "|" + app_user + "|" + totalAmount + "|" + app_time + "|" + embed_data + "|" + item;
    
    const rawSignatureBodyCheckZALOPAY = app_id + "|" + app_trans_id + "|" + zaloPay.key1;

    const signatureBodyPaymentZALOPAY = crypto.createHmac('sha256', zaloPay.key1)
        .update(rawSignBodyPaymentZALOPAY)
        .digest('hex');

    const signatureBodyCheckZALOPAY = crypto.createHmac('sha256', zaloPay.key1)
        .update(rawSignatureBodyCheckZALOPAY)
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

    const requestBodyCheckZALOPAY = JSON.stringify({
        app_id: app_id,
        app_trans_id: app_trans_id,
        mac: signatureBodyCheckZALOPAY
    });

    const paymentZALOPAYRequestBody = {
        method: "POST",
        url: "https://sb-openapi.zalopay.vn/v2/create",
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBodyPaymentZALOPAY),
        },
        data: requestBodyPaymentZALOPAY
    }
    
    const paymentZALOCheckBody = {
        method: "POST",
        url: "https://sb-openapi.zalopay.vn/v2/query",
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBodyCheckZALOPAY),
        },
        data: requestBodyCheckZALOPAY
    }

    async function getPaymentDataZALOPAY(paymentCheckBody) {
      try {
        const response = await axios (paymentCheckBody);
        const responseData = response.data;
        const extractedData = {
          return_code: responseData.return_code,
          return_message: responseData.return_message,
          zp_trans_id: responseData.zp_trans_id,
        };
        return extractedData;
      } catch (error) {
        console.error(error);
      }
    }

    async function checkPaymentZALOPAY(extractedData) {
        return extractedData.return_code == 1;
    }

    let result;
    try {
        // MOMO
        if (paymentChoice == "MOMO") {
            console.log("Making MOMO payment");
            console.log(req.body);
            console.log(requestBodyPaymentMOMO);
            console.log(paymentMOMORequestBody);
            result = await axios (paymentMOMORequestBody);
            console.log(result);
            res.status(200).json(result.data);

        //VNPAY
        } else if (paymentChoice == "VNPAY") {
            console.log("Making VNPAY payment");
            console.log(req.body);
            console.log(paymentVNPAYRequestBody());
            const paymentUrl = await axios (paymentVNPAYRequestBody());
            console.log(paymentUrl);
            
            res.status(200).json({
                statusCode: 200,
                payUrl: paymentUrl
            });
            
        //ZALOPAY
        } else if (paymentChoice == "ZALOPAY") {
            console.log("Making ZALOPAY payment");
            console.log(requestBodyPaymentZALOPAY);
            result = await axios(paymentZALOPAYRequestBody);
            console.log(result);
            console.log(result.data);
            res.status(200).json(result.data);
        }   
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
    
}