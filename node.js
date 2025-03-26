
const endpoients="https://easierserver-production.up.railway.app/api/v1/main/transactions"


for (let i = 0; i < 200; i++) {
  async function getCall(){
    const res=await fetch(endpoients)
    const data=await res.json()
    console.log(i+" - ok - " + res.status + data.message);
  }
  getCall()
}