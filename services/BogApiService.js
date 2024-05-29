const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const BogApiService = {
  baseUrl: process.env.API_BASE_URL,
  apiPassword: process.env.API_PASSWORD,
  apiLogin: process.env.API_LOGIN,
  salt: process.env.SALT,

  async loginPlayer(username, password) {
    try {
      const response = await axios.post(this.baseUrl, {
        api_password: this.apiPassword,
        api_login: this.apiLogin,
        method: 'loginPlayer',
        user_username: username,
        user_password: await bcrypt.hash(password, 10),
        currency: 'EUR',
      });

      const responseData = response.data;

      if (responseData.error === 0) {
        console.log('Player Login Successful', responseData.response);
      } else {
        console.error('Player Login Failed', responseData.message);
      }

      return responseData;
    } catch (error) {
      console.error('HTTP Request Error:', error.message);
      return { error: 1, message: 'Error in API request' };
    }
  },

  async getGameDirect(gameId, lang = 'en', playForFun = false, homeUrl, req) {
    const token = req.headers.authorization;

    if (token) {
      try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);
        const username = decoded.username;

        const requestData = {
          api_password: this.apiPassword,
          api_login: this.apiLogin,
          method: 'getGameDirect',
          lang: lang,
          user_username: username,
          gameid: gameId,
          homeurl: homeUrl,
          play_for_fun: playForFun,
          currency: 'EUR',
        };

        const response = await axios.post(this.baseUrl, requestData);
        const responseData = response.data;

        if (responseData.error === 1) {
          console.error('API Error:', responseData.message);
        }

        return responseData;
      } catch (error) {
        console.error('Error decoding token:', error.message);
        return { error: 1, message: 'Error decoding token' };
      }
    } else {
      return { error: 1, message: 'Token not provided' };
    }
  },

  async playerExists(username) {
    try {
      const response = await axios.post(this.baseUrl, {
        api_password: this.apiPassword,
        api_login: this.apiLogin,
        method: 'playerExists',
        user_username: username,
        currency: 'EUR',
      });

      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error.message);
      return { error: 1, message: 'Error in API request' };
    }
  },

  async getGameList() {
    try {
      const response = await axios.post(this.baseUrl, {
        api_password: this.apiPassword,
        api_login: this.apiLogin,
        method: 'getGameList',
        show_systems: 0,
        show_additional: false,
        currency: 'EUR',
      });

      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error.message);
      return { error: 1, message: 'Error in API request' };
    }
  },

  async createPlayer(username, password) {
    try {
      const response = await axios.post(this.baseUrl, {
        api_password: this.apiPassword,
        api_login: this.apiLogin,
        method: 'createPlayer',
        user_username: username,
        user_password: password,
        currency: 'EUR',
      });

      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error.message);
      return { error: 1, message: 'Error in API request' };
    }
  },
};

module.exports = BogApiService;
