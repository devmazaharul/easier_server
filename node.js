
const endpoients="https://easierserver-production.up.railway.app/api/v1/main/transactions"


for (let i = 0; i < 20; i++) {
  async function getCall(){
    const res=await fetch(endpoients,{
      method:"GET",
      headers:{
        Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWF6YSIsImVtYWlsIjoibWF6YUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDI3MjQyMjF9.tVxa1JE_0zqIbKoCtkf-PVYfxfWG0-AoOGbKTe6Ly3U"
      }
    })
    const data=await res.json()
    console.log(i+" - ok - " + res.status + data.message);
  }
  getCall()
}