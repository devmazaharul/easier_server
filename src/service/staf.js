const CustomError = require("../../responce/error/CustomEror");
const validRes = require("../../responce/validRes");
const { hashGenarate, verifyHash } = require("../../validation/form");
const { genarateToken } = require("../../validation/jwt");
const { stafModel } = require("../model/staf");
const { userModel } = require("../model/user");

const stafRegisterServices=async(adminEmail,{name,number,address,password})=>{
  try {
    const checkstafAcc=await stafModel.findOne({number}) //chek already staf exist or not
    if(checkstafAcc) throw new CustomError("Use another number for staf it already exist");
    const findAdmin=await userModel.findOne({email:adminEmail}).populate("staf");
    if(!findAdmin) throw new CustomError("Invalid token or login again");
    if(findAdmin.number==number) throw new CustomError("Please use another number");
    findAdmin.staf.find((val)=>{
      if(val.name==name){
          name=name + "-" + Math.floor(Math.random()*99)
      }
    })

    if(!findAdmin) throw new CustomError("You are not authorize user")
    const hashPass=await hashGenarate(password);
    const addNewstaf=new stafModel({
      name,number,address,password:hashPass,adminId:findAdmin._id
    });
    findAdmin.staf.push(addNewstaf._id); //add staf id in admin table
    await addNewstaf.save()
    await findAdmin.save()
    return validRes({
      message:"Staf added",
      status:200,
      data:{
        stafId:addNewstaf._id,
        stafName:name,
        stafAddress:address,
        status:"Inactive"
      }
    })
  } catch (error) {
    throw new CustomError(error.message,error.status)    
  }
}


const stafLoginServices=async({number,password})=>{
  try {
    const findStaf=await stafModel.findOne({number}).select("-_id -__v -password")
    if(!findStaf) throw new CustomError("Invalid staf credentials")
      if(!verifyHash(password)) throw new CustomError("Invalid staf credentials")
        if(!findStaf.isActive) throw new CustomError("Staf account not active");
    //genarate token and send to user
    const gentoken=genarateToken({
        id:findStaf._id,
      name:findStaf.name,
      number:findStaf.number,
      role:"staf"
    })

          return validRes({
            message:"Success",
            status:200,
            data:{
              token:gentoken,
              name:findStaf.name,
            }
          })
  } catch (error) {
    throw new CustomError(error.message,error.status)    
  }
}

const activeAccservice=async(adminId,id)=>{
  try {
    const findStaf=await userModel.findOne({email:adminId}).populate("staf","-password")
    if(!findStaf) throw new CustomError("Invalid token or again login");
    //check stacf account is active or not active if active then throw error else active the account
    const checkStaf= findStaf.staf.find((val)=>val._id==id)
    if(!checkStaf) throw new CustomError("Invalid staf ID4") 
    if(checkStaf.isActive) throw new CustomError("Staf account already activated")
    checkStaf.isActive=true;
    await checkStaf.save();

    return validRes({
      message:"Staf account activated",
      status:200,
      data:{
        name:checkStaf.name
      }
    })
    
  } catch (error) {
    throw new CustomError(error.message,error.status) 
  }
}


const getStafinfoService=async(adminId,stafID)=>{
  try {
    const findStaf=await userModel.findOne({email:adminId}).populate("staf","-password -__v");
    if(!findStaf) throw new CustomError("Invalid token or again login");
    const checkStaf= findStaf.staf.find((val)=>val._id==stafID)
    if(!checkStaf) throw new CustomError("Invalid staf ID")
    return validRes({
      message:"Success",
      status:200,
      data:checkStaf
    })
  } catch (error) {
    throw new CustomError(error.message,error.status) 
  }
}

const updateStafService=async(adminId,stafID,{name,address})=>{
  try {
    const findStaf=await userModel.findOne({email:adminId}).populate("staf","-password -__v");
    if(!findStaf) throw new CustomError("Invalid token or again login");

    const checkStaf= findStaf.staf.find((val)=>val._id==stafID);
    if(!checkStaf) throw new CustomError("Invalid staf ID");

    if(name){
      const findSamename=findStaf.staf.find((val)=>val.name==name);
      if(findSamename) throw new CustomError("Please use another name")
    }
  
    if(name){
      checkStaf.name=name
    }
    if(address){
      checkStaf.address=address
    }
    await checkStaf.save()
    return validRes({
      message:"Staf updated",
      status:200,
      data:checkStaf
    })
  } catch (error) {
    throw new CustomError(error.message,error.status) 
  }
}

const deleteStafService=async(ownerEmail,stafid)=>{
  try {
    const chekAdmin=await userModel.findOne({email:ownerEmail})
    if(!chekAdmin) throw new CustomError("Invalid token or login again");
    //find staf id in admin table and delete the staf id from admin table and delete the staf account from staf table

    const removestafid=chekAdmin.staf.filter((val)=>{
        return val.toString()!==stafid
    });
    chekAdmin.staf=removestafid;
    await chekAdmin.save()
    const res=await stafModel.findByIdAndDelete(stafid);
    if(!res) throw new CustomError("Alredy deleted or invalid id")
    return validRes({
      message:"Staf account deleted",
      status:200,
      data:{
        stafId:stafid,
        name:res.name

      }
    })

  } catch (error) {
    throw new CustomError(error.message,error.status)
  }
}

module.exports={
  stafRegisterServices,
  stafLoginServices,
  activeAccservice,
  getStafinfoService,
  updateStafService,
  deleteStafService
}