const bcrypt = require('bcrypt');
const isValidName=(name)=>{
  const nameRegex= /^[\u0980-\u09FFa-zA-Z\s\.\'\-]{2,50}$/;
  return nameRegex.test(name)
}

function isValid11DigitBDNumber(number) {
  const regex = /^01[3-9][0-9]{8}$/;
  return regex.test(number);
}

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const verifyHash=async(password="",hash="")=>{
  return await bcrypt.compare(password,hash)
}


const hashGenarate=async(password="")=>{
  return await bcrypt.hash(password,10)
}

const chekMongo24charId=(id="")=>{
   return /^[a-fA-F0-9]{24}$/.test(id);
}
const isValidshopname=(name="")=>{
   return /^[A-Za-z0-9 ]+$/.test(name)

}


module.exports={
  isValidName,
  isValidEmail,
  isValid11DigitBDNumber,
  hashGenarate,
  verifyHash,
  chekMongo24charId,
  isValidshopname
}