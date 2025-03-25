const jwt=require("jsonwebtoken");

const genarateToken=(payload={})=>{
  return jwt.sign(payload,process.env.secret)
}

const verifyToken=(token="")=>{
  return jwt.verify(token,process.env.secret)
}

module.exports={
  verifyToken,
  genarateToken
}