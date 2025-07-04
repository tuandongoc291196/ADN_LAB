// ZaloPay Payment Configuration
try {
    const key1 = 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL';
    const key2 = 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz';
    const app_id = 2553;
    const partnerCode = 'ZALOPAY';
    const app_time = Date.now();
    const embed_data = {
        "redirecturl": "http://localhost:3000/payment-success"
    };
    const bank_code = "";

    // Validate required configuration
    if (!key1 || !key2 || !app_id || !partnerCode) {
        throw new Error("Missing required ZaloPay configuration parameters");
    }

    function generateOrderId() {
        try {
            return partnerCode + new Date().getTime();
        } catch (error) {
            console.error("Error generating ZaloPay order ID:", error);
            throw new Error("Failed to generate ZaloPay order ID");
        }
    }

    module.exports = {
        key1, 
        key2, 
        app_id,
        partnerCode,
        app_time, 
        embed_data, 
        bank_code, 
        partnerCode, 
        generateOrderId
    };
} catch (error) {
    console.error("Error in ZaloPay configuration:", error);
    throw new Error("Failed to load ZaloPay configuration");
}
