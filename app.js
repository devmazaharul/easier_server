require('dotenv').config();
const express = require('express');
const route = require('./src/route');
const yaml=require("yamljs");
const swaggerUI=require("swagger-ui-express");
const limiter=require("express-rate-limit");
const app = express();
const swaggerfile=yaml.load("./swagger.yaml")
app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerfile))
//limit request from same IP address if it over then message will show json format
app.use(limiter({
  windowMs:1*60*1000, //1 min
  max:50, //limit each IP to 50 request per windowMs
  handler:(_req,res)=>{
  res.status(429).json({
    message:"Too many request from this IP,please try again after 1 min",
    status:429,
    hint:"Please try again after 1 miniute",
    timestamp:new Date().toLocaleTimeString()
  })
  }

}))

const port = process.env.port || 8081;
const cors = require('cors');
require("./config/Db")
app.use([express.urlencoded({ extended: true }), express.json(), cors()]);
app.use('/api/v1/main', route);
//not found
app.use((_req, res, _next) => {
  res.status(404).json({
    message: 'Page not found',
  });
});

//error handle

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Error',
    status: err.status || 500,
    hint: `Please check your info otherwise contact out team your trace id ${Math.floor(
      Math.random() * 788055 + 1000
    )}`,
  });
});


  app.listen(port, () => {
    console.log(`Server starting:${port}`);
  });


