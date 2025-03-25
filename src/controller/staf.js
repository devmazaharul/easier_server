const CustomError = require("../../responce/error/CustomEror");
const { isValidName, isValid11DigitBDNumber, chekMongo24charId } = require("../../validation/form");
const { stafRegisterServices, stafLoginServices, activeAccservice, getStafinfoService, updateStafService, deleteStafService } = require("../service/staf");

const StafRegister=async(req,res,next)=>{
  try {
    const name=req.body.name || "";
    const number=req.body.number || "";
    const address=req.body.address || "";
    const password=req.body.password || ""
    const ownerEmail=req.user.email || ""


    if(!name || !number || !address || !password ) throw new CustomError("Invalid field data name,number,address,password")
      if(!ownerEmail) throw new CustomError("Invalid token")
      if(!isValidName(name)) throw new CustomError("Invalid name convention")
        if(!isValid11DigitBDNumber(number)) throw new CustomError("Invalid BD 11 digit number")
          if(password.length>30 || password.length<5) throw new CustomError("Password min 5 and max 30")
          if(address.length>100) throw new CustomError("Address max 100 character")
            const responce=await stafRegisterServices(ownerEmail,{name,number,address,password})
          res.status(responce.status).json(responce)
  } catch (error) {
    next(error)
  }
}
const StafLogin=async(req,res,next)=>{
  try {
    const number=req.body.number || "";
    const password=req.body.password || "";
    if(!number || !password) throw new CustomError("Please provide number and password");
    if(!isValid11DigitBDNumber(number)) throw new CustomError("Invalid bd 11 digit number");
    const responce=await stafLoginServices({number,password})
    res.status(responce.status).json(responce)
  } catch (error) {
    next(error)
  }
}

const activeAcc=async(req,res,next)=>{
try {
  const stafId=req.body.stafid ||"";
  const ownerEmail=req.user.email || "";
  if(!ownerEmail) throw new CustomError("Invalid token")
  if(!stafId ) throw new CustomError("Plese provide staf id");
  if(!chekMongo24charId(stafId)) throw new CustomError("Invalid staf format");
   const responce=await activeAccservice(ownerEmail,stafId)
   res.status(responce.status).json(responce)
} catch (error) {
  next(error)
}
}

const getStafbyid=async(req,res,next)=>{
  try {
    const ownerEmail=req.user.email || "";
    const stafId=req.params.id || "";
    if(!ownerEmail) throw new CustomError("Invalid token");
    if(!stafId) throw new CustomError("Please provide staf ID");
    if(!chekMongo24charId(stafId)) throw new CustomError("Invalid staf ID");
    const responce=await getStafinfoService(ownerEmail,stafId)
    res.status(responce.status).json(responce)
  } catch (error) {
    next(error)
  }
}

const updateStaf=async(req,res,next)=>{
    try {
      const ownerEmail=req.user.email || "";
      const stafId=req.params.id || "";
      const name=req.body.name || "";
      const address=req.body.address || "";
      if(!ownerEmail) throw new CustomError("Invalid token");
      if(!stafId) throw new CustomError("Please provide staf ID");
      if(!chekMongo24charId(stafId)) throw new CustomError("Invalid staf ID");
      if(!name && !address) throw new CustomError("Please provide name or address to update");
      if(name && !isValidName(name)) throw new CustomError("Invalid name convention");
      if(address && (address.length<5 ||  address.length>100)) throw new CustomError("Address min 5 and max 100 character");
      const responce=await updateStafService(ownerEmail,stafId,{name,address});
      res.status(responce.status).json(responce);
    } catch (error) {
      next(error)
    }
}


const deleteStaf=async(req,res,next)=>{
  try {
    const ownerEmail=req.user.email || "";
    const stafId=req.params.id || "";
    if(!ownerEmail) throw new CustomError("Invalid token or login again")
    if(!stafId) throw new CustomError("Invalid staf id")
      if(!chekMongo24charId(stafId)) throw new CustomError("Invalid staf id")
        const responce=await deleteStafService(ownerEmail,stafId);
      res.status(responce.status).json(responce)
  } catch (error) {
    next(error)
  }
}


module.exports={
  StafRegister,
  StafLogin,
  activeAcc,
  getStafbyid,
  updateStaf,
  deleteStaf
}