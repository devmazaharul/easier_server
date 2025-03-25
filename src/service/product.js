const CustomError = require('../../responce/error/CustomEror');
const validRes = require('../../responce/validRes');
const { productModel } = require('../model/product');
const { stafModel } = require('../model/staf');
const { userModel } = require('../model/user');

//add product

const addProductService = async ({
  name,
  amount,
  type,
  usernumber,
  tokenInfo,
}) => {
  try {
    let adminId;
    let entryierId;
    if (tokenInfo.role == 'staf') {
      const findStaf = await stafModel.findOne({ id: tokenInfo.id });
      if (!findStaf) throw new CustomError('Invalid token or login again');
      adminId = findStaf.adminId;
      entryierId = tokenInfo.id;
    }
    if (tokenInfo.role == 'admin') {
      const findAdmin = await userModel.findOne({ email: tokenInfo.email });
      if (!findAdmin) throw new CustomError('Invalid token or login again');
      adminId = findAdmin._id;
      entryierId = findAdmin._id;
    }

    const addProduct = new productModel({
      name,
      amount,
      type,
      userNumber: usernumber,
      adminId: adminId,
      entryierId: entryierId,
    });
    await addProduct.save();
    return validRes({
      message: 'Product added',
      status: 200,
      data: {
        ...addProduct._doc,
      },
    });
  } catch (error) {
    throw new CustomError(error.message, error.status);
  }
};

//filter tracsaction
const getTransactionsService = async ({ trtime, trtype }) => {
  try {
    //write your code here

    let caltime = 7;
    if (trtime == '1m') caltime = 30;
    if (trtime == '7d') caltime = 7;
    if (trtime == '15d') caltime = 15;
    if (trtime == '1d') caltime = 1;
    if (trtime == 'all') caltime = 365; //1years data get

    function calDatetime() {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - caltime);
      return sevenDaysAgo;
    }
    const getProducts = await productModel.find({
      type:
        trtype == 'all'
          ? ['mobile_recharge', 'bill', 'cash_out', 'send_money']
          : trtype,
      createdAt: {
        $gte: calDatetime(),
      },
    });
    if (!getProducts) throw new CustomError('No product found');

    return validRes({
      status: 200,
      message: 'success',
      data: {
        filteredBy: trtime,
        items: getProducts,
      },
    });
  } catch (error) {
    throw new CustomError(error.message, error.status);
  }
};

module.exports = {
  getTransactionsService,
  addProductService,
};
