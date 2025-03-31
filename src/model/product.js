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
  entryierId:
    {
    type:String,
    required:true
    }
  ,
 isUpdate:{
    type:Boolean,
    default:false

  },
  addedBy:{
    type:String,
    required:true
  }
},{timestamps:true})
const productModel=model("products",productSchema);
module.exports={
  productModel
}