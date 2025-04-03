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
      entryierId = findStaf._id;
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
      entryierId:entryierId,
      addedBy:
        tokenInfo.role == 'staf'
          ? 'staf'
          : (tokenInfo.role = 'admin' ? 'admin' : null),
    });
    await addProduct.save();
    return validRes({
      message: 'Product added',
      status: 200,
      data: {
        productId: addProduct._id,
        entiyerId: addProduct.entryierId,
      },
    });
  } catch (error) {
    throw new CustomError(error.message, error.status);
  }
};

//filter tracsaction
const getTransactionsService = async ({ trtime, trtype,userInfo }) => {
  try {
    //write your code here
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);


    let caltime = 7;
    if (trtime == '1m') caltime = 30;
    if (trtime == '7d') caltime = 7;
    if (trtime == '15d') caltime = 15;
    if (trtime == 'all') caltime = 365; //1years data get




    let adminId=""
    if(userInfo.role=="admin"){
        const getAdminId=await userModel.findOne({email:userInfo.email});
        if(!getAdminId) throw new CustomError("Invalid informaton")
        adminId=getAdminId._id;
    }

    if(userInfo.role=="staf"){
      const adminBystaf=await stafModel.findOne({number:userInfo.number})
      if(!adminBystaf) throw new CustomError("Invalid information")
        adminId=adminBystaf.adminId;
    }




    function calDatetime() {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - caltime);
      return sevenDaysAgo;
    }
    const getProducts = await productModel
      .find({
        adminId:adminId && adminId,
        type:
          trtype == 'all'
            ? ['mobile_recharge', 'bill', 'cash_out', 'send_money', 'others']
            : trtype,
        updatedAt: trtime=="today"?{
           $gte: today, $lt: tomorrow 
        }: {
          $gte: calDatetime(),
        },
      })
      .select('-adminId -createdAt -__v');

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

const getProductById = async (productId) => {
  try {
    const findProduct = await productModel
      .findById(productId)
      .select('-__v -createdAt');
    if (!findProduct) throw new CustomError('Product not found');

    const adminInfo =
      findProduct.addedBy == 'admin' &&
      (await userModel
        .findById(findProduct.entryierId)
        .select('-password -createdAt'));
    const stafInfo =
      findProduct.addedBy == 'staf' &&
      (await stafModel.findById(findProduct.entryierId));

    if (findProduct.addedBy == 'admin') {
      return validRes({
        message: 'successfully get data',
        status: 200,
        data: {
          items: findProduct,
          addedByInfo: {
            name: adminInfo.name,
            addedBy: 'admin',
          },
        },
      });
    } else {
      return validRes({
        message: 'successfully get data',
        status: 200,
        data: {
          items: findProduct,
          addedByInfo: {
            name: stafInfo.name,
            addedBy: 'staf',
          },
        },
      });
    }
  } catch (error) {
    throw new CustomError(error.message, error.status);
  }
};

module.exports = {
  getTransactionsService,
  addProductService,
  getProductById,
};
