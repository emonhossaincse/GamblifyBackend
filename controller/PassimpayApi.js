const crypto = require('crypto');
const axios = require('axios');

class PassimpayApi {
  constructor(platformId, secretKey) {
    this.platformId = platformId;
    this.secretKey = secretKey;
    this.urlBase = 'https://api.passimpay.io';
  }

  async _makeRequest(endpoint, data = {}) {
    if (!this.secretKey) throw new Error('59c61c-d7854a-89633c-7725ce-bfc45e');
    if (!this.platformId) throw new Error('845');

    const url = `${this.urlBase}/${endpoint}`;
    data.platform_id = this.platformId;
    
    // Sort the data to ensure the order of parameters is consistent for hashing
    const sortedData = Object.keys(data).sort().reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

    const payloadStr = Object.entries(sortedData).map(([key, value]) => `${key}=${value}`).join('&');
    const hashValue = crypto.createHmac('sha256', this.secretKey).update(payloadStr).digest('hex');
    sortedData.hash = hashValue;

    try {
      const response = await axios.post(url, sortedData);
      console.log(response.status);
      return response.data;
    } catch (error) {
      console.error(error.response ? error.response.status : error.message);
      throw error;
    }
  }

  async balance() {
    const response = await this._makeRequest('balance');
    console.log('Balance:', response);
    return response;
  }

  async currencies() {
    const response = await this._makeRequest('currencies');
    console.log('Currencies:', response);
    return response;
  }

  async invoice(orderId, amount, currencies) {
    const data = {
      order_id: orderId,
      amount: amount,
      currencies: currencies,
    };
    const response = await this._makeRequest('createorder', data);
    console.log('Invoice URL:', response);
    return response;
  }

  async invoiceStatus(id) {
    const data = { order_id: id };
    const response = await this._makeRequest('orderstatus', data);
    console.log('Invoice Status:', response);
    return response;
  }

  async paymentWallet(orderId, paymentId) {
    const data = {
      order_id: orderId,
      payment_id: paymentId,
    };
    const response = await this._makeRequest('getpaymentwallet', data);
    console.log('Payment Wallet Address:', response);
    return response;
  }

  async withdraw(paymentId, amount, addressTo) {
    const data = {
      payment_id: paymentId,
      amount: amount,
      address_to: addressTo,
    };
    const response = await this._makeRequest('withdraw', data);
    console.log('Withdrawal Response:', response);
    return response;
  }

  async transactionStatus(txHash) {
    const data = { txhash: txHash };
    const response = await this._makeRequest('transactionstatus', data);
    console.log('Transaction Status:', response);
    return response;
  }
}

// Usage example (Uncomment and replace with actual values to test)
// const platformId = 'your_platform_id';
// const secretKey = 'your_secret_key';
// const api = new PassimpayApi(platformId, secretKey);

// (async () => {
//   try {
//     await api.balance();
//     await api.currencies();
//     // Add more method calls as needed
//   } catch (error) {
//     console.error(error);
//   }
// })();

module.exports = PassimpayApi;
