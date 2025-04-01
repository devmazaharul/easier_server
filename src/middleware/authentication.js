const CustomError = require('../../responce/error/CustomEror');
const { verifyToken } = require('../../validation/jwt');
const jwt = require('jsonwebtoken');

const authentication = async (req, _res, next) => {
  try {
    let token = req.headers['authorization'] || '';
 
    if (!token) throw new CustomError('Invalid token');
    if (!token.startsWith('Bearer'))
      throw new CustomError('Invalid token convention start with Bearer');
    token = token.split(' ')[1];
    const tokenVerify = verifyToken(token);
    if (Object.keys(tokenVerify).length > 0 && tokenVerify.role == 'admin') {
      req.user = tokenVerify;
      next();
    } 
     if (Object.keys(tokenVerify).length > 0 && tokenVerify.role == 'staf') {
      req.user = tokenVerify;
      next();
    }
  } catch (error) {
    next(error);
  }
};


const authorization=(role=[])=>(req,res,next)=>{
  try {
    if(role.includes(req.user.role)){
       next()
    }else{
      throw new CustomError("Access denite",400)
    }

  } catch (error) {
    next(error)
  }
}



module.exports = {
  authentication,
  authorization
};
