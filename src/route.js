const {

  transactions,
  addProduct,
  getProduct,
} = require('./controller/product');
const {
  StafRegister,
  StafLogin,
  activeAcc,
  getStafbyid,
  updateStaf,
  deleteStaf,
} = require('./controller/staf');
const { Register, Login, SendCode, verifyAccount } = require('./controller/user');
const {
  authentication,
  authorization,
} = require('./middleware/authentication');
const route = require('express').Router();
//POST : http://host:port/api/v1/endpoints

//without authenticaton
route.post('/register', Register); //done
route.post('/', Login); //done
route.patch("/send_code",SendCode)
route.patch("/active_account",verifyAccount)

//with authentication
route
  .route('/')
  .get(authentication, authorization(['admin', 'staf']))
  .patch(authentication, authorization(['admin']))
  .delete(authentication, authorization(['admin']));

//product routes
route.post(
  '/transactions',
  authentication,
  authorization(['admin', 'staf']),
  addProduct
); //add new tranction
route.get(
  '/transactions',
  authentication,
  authorization(['admin', 'staf']),
  transactions
); //default last 1m transaction ?time=[all,nM,7d] type=recharge&&searchFiled=name&&text=val

//product action route groupp
route.route("/transactions/:id")
.get(authentication,authorization(["admin","staf"]),getProduct)
.patch(authentication,authorization(["admin","staf"]))
.delete(authentication,authorization(["admin","staf"]))


//staf part
route.post('/stafs', authentication, StafRegister); //add staf
route.post('/stafs/access', StafLogin); //login staf
route.patch(
  '/stafs/active',
  authentication,
  authorization(['admin']),
  activeAcc
); //active staf accout

route
  .route('/stafs/:id')
  .get(authentication, authorization(['admin']), getStafbyid)
  .patch(authentication, authorization(['admin', 'staf']), updateStaf)
  .delete(authentication, authorization(['admin']), deleteStaf);

module.exports = route;
