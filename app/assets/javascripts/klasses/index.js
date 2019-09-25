$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes$/.test(window.location.href)){
    getIndexData()
  }
})

function getIndexData(forHeader = false, forIndexHeader = false){
  $('main')[0].innerHTML = ''
  $.get(`/classes.json`, function(json){
    for (i = 0; i<json.length; i++){
      klasses.push(new Klass(json[i]))
    }
    new Teacher(json[0].teachers[0])
    if (forIndexHeader) {
      renderIndexHeader()
    } else {
      klass = Klass.find(window.location.href.split("/")[4])
      forHeader ? renderHeader() : renderIndexPage()
    }
  })
}

function renderIndexPage(){
  const indexHtml = Klass.formatIndex()
  $('main').append(indexHtml)
  $('.class-link').click(clickOnClass)
  $('.index-new-klass-button').click(addNewKlass)
  $('.class-edit-link').click(editKlass)
  renderIndexHeader()
  history.pushState(null, null, `http://localhost:3000/classes`)
}

function clickOnClass(e){
  e.preventDefault()
  klass = Klass.find(this.dataset.id)
  $('main')[0].innerHTML = ''
  renderHeader()
  getKlassData(klass.id)
}

function addNewKlass(e){
  e.preventDefault()
  getIndexData(forHeader = false, forIndexHeader = true)
  renderNewKlassForm()
}

function editKlass(e){
  e.preventDefault()
  const klassId = this.href.split('/')[4]
  getIndexData(forHeader = false, forIndexHeader = true)
  getKlassDataBeforeEdit(klassId)
}
