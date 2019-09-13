$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes$/.test(window.location.href)){
    getIndexData()
  }
})

function getIndexData(){
  console.log("index data!")
}
