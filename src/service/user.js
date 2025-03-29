const { mailSend } = require("../../config/mail");
const CustomError = require("../../responce/error/CustomEror");
const validRes = require("../../responce/validRes");
const { hashGenarate,verifyHash } = require("../../validation/form");
const { genarateToken } = require("../../validation/jwt");
const {userModel}=require("../model/user")
const registerService=async({name,email,password,shopName,address,gender,number})=>{
  try {
    const findUser=await userModel.findOne({email})
    if(findUser) throw new CustomError("User already exist");
    const hashpass=await hashGenarate(password)
    const addUserObj=new userModel({
      name,email,number,address,gender,password:hashpass,shopName
    })

    await addUserObj.save()
    return validRes({
      message:"successfully register",
      status:201,
      data:{
        name,
        email
      }
    })

  } catch (error) {
    throw new CustomError(error.message || "Something went wrong",error.status || 400)
  }
}


const loginService=async({email,password})=>{
  try {
    const findUser=await userModel
    .findOne({email})   
    if(!findUser) throw new CustomError("User not found")
    const isMatch=await verifyHash(password,findUser.password)
  if(!isMatch) throw new CustomError("Invalid Credential");
  if(!findUser.isActive) throw new CustomError("Please verify your account then login.")
      const token=genarateToken({
        name:findUser.name,
        email:findUser.email,
        role:findUser.role
      });

    return validRes({
      message:"successfully login",
      status:200,
      data:{
        name:findUser.name,
        email:findUser.email,
        token:`Bearer ${token}`
      }
    })  
  } catch (error) {
    throw new CustomError(error.message || "Something went wrong",error.status || 400)
  }
}


const CodeSendService=async(email)=>{
  try {
    const chekMail=await userModel.findOne({email})
    if(!chekMail) throw new CustomError("Invalid email address")
      if(chekMail.isActive) throw new CustomError("Already verifed your account");
    const verifyCode=Math.floor(Math.random()*99999)
    await mailSend(email,chekMail.name,verifyCode)
     chekMail.activeCode=verifyCode
      await chekMail.save()
      return validRes({
        message:"Chek your email box",
        status:200,
        data:{
          mesage:"Code send your mail check your inbox."
        }
      })
    
  } catch (error) {
    throw new CustomError(error.message,error.status)
  }
}


const verifyAccountwithCode=async(email,code)=>{
  try {
    const chekAcc=await userModel.findOne({email})
    if(!chekAcc) throw new CustomError("Invalid email address")
      if(chekAcc.isActive) throw new CustomError("Already verified")
      if(!chekAcc.activeCode==code) throw new CustomError("Invalid code");
    chekAcc.isActive=true
  await chekAcc.save()
  return validRes({
    message:"Successfully account verified",
    status:200
  })
    
  } catch (error) {
    throw new CustomError(error.mesage,error.status)
  }
}
module.exports={
  registerService,
  loginService,
  CodeSendService,
  verifyAccountwithCode
}