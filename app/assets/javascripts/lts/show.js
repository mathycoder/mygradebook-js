$().ready(() => {
  $('.class-header select').change(switchClass)
  if (/^http:\/\/localhost:3000\/classes\/\d\/lts\/\d$/.test(window.location.href)){
    getLtData()
  }
})

function getLtData(){
  alert("worked!")
}
