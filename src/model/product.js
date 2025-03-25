const {Schema,model}=require("mongoose")

const productSchema=new Schema({
 name:{
   type:String,
   required:true
 },
 amount:{
    type:Number,
    required:true
  },
  type:{
    type:String,
    required:true
  },
  userNumber:{
    type:String
  },
  adminId:{
    type:Schema.ObjectId,
    ref:"users"
  },
  entryierId:[
    {
    type:String,
    required:true
    }
  ],
  trTime:{
    type:Date,
    default:Date.now()
  }
},{timestamps:true})
const productModel=model("products",productSchema);
module.exports={
  productModel
}