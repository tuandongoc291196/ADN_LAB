const key1 = 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL';
const key2 = 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz';
const app_id = 2553;
const partnerCode = 'ZALOPAY';
const app_time = Date.now();
const embed_data = {};
const bank_code = "";

function generateOrderId() {
  return partnerCode + new Date().getTime();
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
