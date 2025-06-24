// MoMo Payment Configuration
try {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'Pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = 'http://localhost:5173/';
    const ipnUrl = 'http://localhost:5173/';
    const requestType = "captureWallet";
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;
    const orderExpireTime = 0.2;
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
