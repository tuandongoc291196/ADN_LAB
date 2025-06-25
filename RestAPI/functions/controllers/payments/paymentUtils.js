const { getPaymentDataMOMO } = require('./momoPayment');

const checkPaymentStatus = async (paymentMethod, paymentResult) => {
  const maxDuration = 15 * 60 * 1000; 
  const checkInterval = 5 * 1000; 
  const startTime = Date.now();

  console.log(`Starting payment status check for ${paymentMethod} payment`);
  console.log(`Initial payment result:`, paymentResult);

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= maxDuration) {
          console.log('Payment status check timeout - 15 minutes elapsed');
          resolve(false);
          return;
        }

        let statusResult;

        if (paymentMethod === "MOMO") {
          statusResult = await getPaymentDataMOMO(paymentResult.orderId, paymentResult.requestId);
          console.log(`MOMO payment status check at ${new Date().toISOString()}:`, statusResult);

          if (statusResult && statusResult.resultCode === 0) {
            console.log('Payment successful - resultCode is 0');
            resolve(true);
            return;
          }

          if (statusResult && statusResult.resultCode && statusResult.resultCode !== 1000) {
            console.log(`Payment failed with resultCode: ${statusResult.resultCode}`);
            resolve(false);
            return;
          }
          
        } else if (paymentMethod === "VNPAY") {
          console.log("VNPAY payment status checking not implemented yet");
          resolve(false);
          return;
          
        } else if (paymentMethod === "ZALOPAY") {
          console.log("ZALOPAY payment status checking not implemented yet");
          resolve(false);
          return;
          
        } else {
          console.log(`Invalid payment method: ${paymentMethod}`);
          resolve(false);
          return;
        }

        setTimeout(checkStatus, checkInterval);

      } catch (error) {
        console.error('Error checking payment status:', error);
        reject(error);
      }
    };

    checkStatus();
  });
};

module.exports = {
  checkPaymentStatus
};