const {Schema,model}=require("mongoose")

const stafSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  number:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    default:"staf"
  },
  adminId:{
    type:Schema.ObjectId,
    ref:"users"
  },
  isActive:{
    type:Boolean,
    default:false
  },
  isRestric:{
    type:Boolean,
    default:false
  }
})

const stafModel=model("stafs",stafSchema);

module.exports={
  stafModel
}