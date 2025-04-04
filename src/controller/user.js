const CustomError = require('../../responce/error/CustomEror');
const {
  isValidName,
  isValid11DigitBDNumber,
  isValidEmail,
  isValidshopname,
} = require('../../validation/form');
const { registerService, loginService, CodeSendService, verifyAccountwithCode } = require('../service/user');

const Register = async (req, res, next) => {
  console.log("hit");
  try {
    console.log(req.body);
    const name = req.body.name || '';
    const email = req.body.email || '';
    const number = req.body.number || '';
    const gender = req.body.gender || 'male';
    const address = req.body.address || '';
    const password = req.body.password || '';
    const shopName = req.body.shopname || '';
    if (!name || !email || !number || !password || !address || !shopName)
      throw new CustomError(
        'Invalid form field value name,email,number,password,address,shopName'
      );
    if (!isValidName(name)) throw new CustomError('Invalid name convention');
    if (!isValid11DigitBDNumber(number)) throw new CustomError('Invalid BD 11 Digit number');
    if (!isValidEmail(email)) throw new CustomError('Invalid Email addresss');
    if (password.length < 5) throw new CustomError('Password minimum 5 digit');
    if(!address.length>100) throw new CustomError('Address max 100 character');
    if(!shopName.length>30) throw new CustomError('Shop name max 30 character');
    if(!isValidshopname(shopName)) throw new CustomError('Shop name  only alphabets and numbers');
    const responce = await registerService({
      name,
      email,
      password,
      shopName,
      address,
      gender,
      number,
    });
    res.status(responce.status || 200).json(responce || {});
  } catch (error) {
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    const email = req.body.email || '';
    const password = req.body.password || '';
    if (!email || !password)
      throw new CustomError('Invalid form field value email,password');
    if (!isValidEmail(email)) throw new CustomError('Invalid Email addresss');
    const responce = await loginService({ email, password });
    res.status(responce.status || 200).json(responce || {});
  } catch (error) {
    next(error);
  }
};


const SendCode=async(req,res,next)=>{
  try {
    const email=req.body.email||""
    if(!email) throw new CustomError("Please provide email address")
      if(!isValidEmail(email)) throw new CustomError("Please provide a valid email address")
        const responce=await CodeSendService(email);
      res.status(responce.status).json(responce)

  } catch (error) {
    next(error)
  }
}


const verifyAccount=async(req,res,next)=>{
  try {
    const email=req.body.email || ""
    const code=req.body.code || ""

    if(!email || !code) throw new CustomError("Please provide email and verification code")
      if(!isValidEmail(email)) throw new CustomError("Plese provide valid email")
        const responce=await verifyAccountwithCode(email,code)
      res.status(responce.status).json(responce)

  } catch (error) {
    next(error)
  }
}

module.exports = {
  Register,
  Login,
  SendCode,
  verifyAccount
};
