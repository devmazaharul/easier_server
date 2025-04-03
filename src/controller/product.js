const CustomError = require('../../responce/error/CustomEror');
const {
  isValidName,
  isValid11DigitBDNumber,
} = require('../../validation/form');
const {
  getTransactionsService,
  addProductService,
  getProductById,
} = require('../service/product');

const addProduct = async (req, res, next) => {
  try {
    const name = req.body.name || '';
    const amount = req.body.amount || '';
    const type = req.body.type || 'others';
    const usernumber = req.body.number || '';
    const tokenInfo = req.user || '';
    if (!name || !amount || !type)
      throw new CustomError('Invalid field data name,amount,type');
    if (!amount > 0 || amount > 9999999999)
      throw new CustomError('Invalid amount');
    if (!tokenInfo) throw new CustomError('Invalid token');
    if (!isValidName(name)) throw new CustomError('Invalid name convention');
    const validTypes = [
      'others',
      'mobile_recharge',
      'bill',
      'send_money',
      'cash_out',
    ];

    if (validTypes.includes(type) == false)
      throw new CustomError(
        'Please provide correct type of product avabile product type mobile_recharge, cash_out, send_money and others.'
      );

    if (
      (type == 'mobile_recharge' ||
        type == 'bill' ||
        type == 'send_money' ||
        type == 'cash_out') &&
      !isValid11DigitBDNumber(usernumber)
    )
      throw new CustomError('Invalid user number');

    const responce = await addProductService({
      name,
      amount,
      type,
      usernumber,
      tokenInfo,
    });
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

//default last 1m transaction ?time=[all,nM,7d]&&type=recharge
const transactions = async (req, res, next) => {
  try {
    const queryFilter = req.query;
    const userInfo=req.user;
    const validTypes = [
      'others',
      'mobile_recharge',
      'bill',
      'send_money',
      'cash_out',
      "all"
    ]; //filter option by type
    const validDate = ['1m', '15d', '7d', 'today', 'all']; //filter option by date

    let trtime = '7d';
    let trtype = 'all';

    if (queryFilter) {
      if (queryFilter.time) {
        if (!validDate.includes(queryFilter.time))
          throw new CustomError(
            'Invalid filter time avabile time 1m, 15d, all, today, and all default 7d'
          );
        trtime = queryFilter.time;
      }
      if (queryFilter.type) {
        if (!validTypes.includes(queryFilter.type))
          throw new CustomError(
            'Please provide correct type of product avabile product type mobile_recharge, cash_out, send_money others and all.'
          );
        trtype = queryFilter.type;
      }
    }

    const responce = await getTransactionsService({ trtime, trtype,userInfo});
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};


const getProduct=async(req,res,next)=>{
  try {
    const productId=req.params.id;

    if(!productId) throw new CustomError("Invalid product id")

        const respone=await getProductById(productId)
      res.status(respone.status).json(respone)
  } catch (error) {
    next(error)
  }
}



module.exports = {
  transactions,
  addProduct,
  getProduct
};
