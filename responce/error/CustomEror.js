class CustomError extends Error{
  constructor(message="Something went wrong",status=400){
      super(message)
      this.status=status
      this.name="customError"
  }

}

module.exports=CustomError