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
      status:200,
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
      const token=genarateToken({
        name:findUser.name,
        email:findUser.email,
        role:findUser.role
      })
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

module.exports={
  registerService,
  loginService
}