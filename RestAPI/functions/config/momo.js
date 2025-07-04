// MoMo Payment Configuration
try {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'Pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = 'http://localhost:3000/payment-success';
    const ipnUrl = 'http://localhost:3000/';
    const requestType = "payWithMethod";
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;
    const orderExpireTime = 15;
    const lang = 'en';

    // Validate required configuration
    if (!accessKey || !secretKey || !partnerCode) {
        throw new Error("Missing required MoMo configuration parameters");
    }

    module.exports = {
        accessKey,
        secretKey,
        orderInfo,
        partnerCode,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData,
        orderGroupId,
        autoCapture,
        orderExpireTime,
        lang
    };
} catch (error) {
    console.error("Error in MoMo configuration:", error);
    throw new Error("Failed to load MoMo configuration");
}
