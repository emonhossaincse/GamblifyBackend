const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/UserModel');

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

      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error.message);
      return { error: 1, message: 'Error in API request' };
    }
  },

  async getGameDirect(gameId, lang = 'en', playForFun = false, homeUrl, req) {
    try {
      // Retrieve user from the database using the username from the request
      const username = req.body.username; // Assume the username is sent in the request body
      const user = await User.findOne({ username });

      if (!user || !user.token) {
        return { error: 1, message: 'User not found or token missing' };
      }

      const requestData = {
        api_password: this.apiPassword,
        api_login: this.apiLogin,
        method: 'getGameDirect',
        lang: lang,
        user_username: user.username,
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
      console.error('Error in getGameDirect:', error.message);
      return { error: 1, message: 'Error in API request' };
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
