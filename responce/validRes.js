
function validRes({message="",status=200,data}){
return {
  message:message?? "success",
  status:status,
  data:data ?? {}
}
}

module.exports=validRes;