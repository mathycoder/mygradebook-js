$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes$/.test(window.location.href) || /^http:\/\/my-gradebook.herokuapp.com\/classes$/.test(window.location.href)){
    getIndexData()
  }
})

function getIndexData(forHeader = false, forIndexHeader = false){
  $('main')[0].innerHTML = ''
  $.get(`/classes.json`, function(json){
    for (i = 0; i<json.klasses.length; i++){
      klasses.push(new Klass(json.klasses[i]))
    }
    new Teacher(json.teacher)
    if (forIndexHeader) {
      renderIndexHeader()
    } else if (forHeader){
      klass = Klass.find(window.location.href.split("/")[4])
      renderHeader()
    } else {
      renderIndexPage()
    }
  })
}

function renderIndexPage(){
  const indexHtml = Klass.formatIndex()
  $('main').append(indexHtml)
  $('.class-link').click(clickOnClass)
  $('.index-new-klass-button').click(addNewKlass)
  $('.index-new-student-button').click(addNewStudentToSchool)
  $('.class-edit-link').click(editKlass)
  renderIndexHeader()
  if (/^http:\/\/localhost:3000$/.test(window.location.href) {
    history.pushState(null, null, `http://localhost:3000/classes`)
  } else {
    history.pushState(null, null, `http://my-gradebook.herokuapp.com/classes`)
  }

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

function addNewStudentToSchool(e){
  e.preventDefault()
  getIndexData(forHeader = false, forIndexHeader = true)
  getStudentsIndexData()
}

function editKlass(e){
  e.preventDefault()
  const klassId = this.href.split('/')[4]
  getIndexData(forHeader = false, forIndexHeader = true)
  getKlassDataBeforeEdit(klassId)
}
