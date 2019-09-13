$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes$/.test(window.location.href)){
    getIndexData()
  }
})

function getIndexData(){
  $('main')[0].innerHTML = ''
  $.get(`/classes.json`, function(json){
    for (i = 0; i<json.length; i++){
      klasses.push(new Klass(json[i]))
    }
    let indexHtml = Klass.formatIndex(json[0].teachers[0].name)
    $('main').append(indexHtml)
    $('.class-link').click(clickOnClass)
  })
}

function clickOnClass(e){
  e.preventDefault()
  const klassId = this.dataset.id
  $('main')[0].innerHTML = ''
  clearData()
  getData(klassId)
}
