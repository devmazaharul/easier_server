const { Schema, model } = require('mongoose');

const userSchema =new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  staf:[{
    type:Schema.ObjectId,
    ref:"stafs"
  }],
  role:{
    type:String,
    default:"admin"
  },
  isActive:{
    type:Boolean,
    default:false
  }
});

const userModel = model('users', userSchema);
module.exports = {userModel};
