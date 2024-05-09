const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  remote_id: {
    type: String,
    required: true,
  },
  session_id: {
    type: String,
   
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
   
  },
  phone: {
    type: String,
   
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be 6 characters long'],
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
  },
  first_name: {
    type: String,
  
  },
  last_name: {
    type: String,
  
  },
  address: {
    type: String,
  
  },
  city: {
    type: String,
  
  },
  state: {
    type: String,
  
  },
  postal_code: {
    type: String,
  
  },
  country: {
    type: String,
  
  },
  token: {
    type: String,
  
  },
  balance: {
    type: Number, // Define balance as a Number type
    default: 0, // Set a default value if needed
  
  },
  status: {
    type: String,
    enum: ['ban', 'Active', 'Inactive', 'Online'],
    default: 'Active'
  },
  email_verify: {
    type: Boolean,
    default: false,
  },
  phone_verify: {
    type: Boolean,
    default: false,
  },
  auth_verify: {
    type: Boolean,
    default: false,
  },

  user_role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  }
}, { timestamps: true, }); // Enable timestamps option

const User = mongoose.model('User', userSchema);

module.exports = User;
