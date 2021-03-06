function renderHeader(){
  $('header')[0].innerHTML = ''
  const headerHtml = klass.renderShowHeader()
  $('header').append(headerHtml)
  addShowHeaderListeners()
}

function addShowHeaderListeners(){
  $('.header-logo').parent().click(goHome)
  $('.add-assignment-button').click(addAssignment)
  $('.add-lt-button').click(addLt)
  $('.add-student-button').click(addStudentPage)
  $('.class-header select').change(switchClass)
  $('.lt-header select').change(switchLt)
  $('.student-header select').change(switchSt)
}

function renderIndexHeader(){
  $('header')[0].innerHTML = ''
  const headerHtml = Klass.renderIndexHeader()
  $('header').append(headerHtml)
  addIndexHeaderListeners()
}

function addIndexHeaderListeners(){
  $('.header-logo').parent().click(goHome)
}

function goHome(event){
  event.preventDefault()
  const klassId = parseInt(window.location.href.split("/")[4])
  if (klassId && window.location.href.split("/")[5] != "edit"){
    clearData()
    getIndexData(forHeader = true)
    getKlassData()
  } else {
    clearData()
    getIndexData()
  }
}

function addAssignment(e){
  clearData()
  getIndexData(forHeader = true)
  getAssignmentFormData()
}

function addStudentPage(e){
  const klassId = klass.id
  clearData()
  getIndexData(forHeader = true)
  getStudentIndexPageData(klassId)
}

function addLt(){
  const klassId = klass.id
  clearData()
  getIndexData(forHeader = true)
  getLtFormData(klassId)
}

function adjustHeader(){
  // adjust logo and buttons
  $('.header-logo').parent()[0].href = `http://localhost:3000/classes/${klass.id}`
  $('header div form')[0].action = `http://localhost:3000/classes/${klass.id}/assignments/new`
  $('header div form')[1].action = `http://localhost:3000/classes/${klass.id}/lts/new`
  $('header div form')[2].action = `http://localhost:3000/classes/${klass.id}/students`
  //adjust LTs in dropdown
  $('.select-lts option:first-child')[0].innerText = "Learning Targets"
  $('.select-lts option:first-child').nextAll().remove()
  $('.select-lts').parent()[0].action = `http://localhost:3000/classes/${klass.id}/learning_targets/redirect`
  learningTargets.forEach(lt => $('.select-lts option:first-child').parent().append(`<option value="${lt.id}">${lt.name}</option>`))
  // adjust students in dropdown
  $('.select-students option:first-child')[0].innerText = "Students"
  $('.select-students option:first-child').nextAll().remove()
  $('.select-students').parent()[0].action = `http://localhost:3000/classes/${klass.id}/students/redirect`
  students.forEach(st => $('.select-students option:first-child').parent().append(`<option value="${st.id}">${st.fullName()}</option>`))
}

function renderFlash(flash){
  let html = ''
  html += `
    <div onclick="style.display='none'; return false;" data-alert class="flash error alert-box radius">
      <a href="" class="close">x</a>
      <span>${flash}</span>
    </div>
  `
  $('main').prepend(html)
}

function renderErrorMessages(array){
  $('.error-messages ul').children().remove()
  array.forEach(message => {
    $('.error-messages ul').append(`<li style="color: red">${message}</li>`)
  })
}
