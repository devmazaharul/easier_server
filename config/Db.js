const mongoose = require('mongoose');

mongoose.connect(process.env.db_uri)
.then(()=>{
  console.log("Db Conneced");
}).catch((er)=>{
  console.log("Db not connected");
})