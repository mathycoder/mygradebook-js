function checkForShowHeader() {
  if ($('header').children().length === 0 && klass) {
    renderHeader()
  }
}

function renderHeader(){
  $('header')[0].innerHTML = ''
  const headerHtml = klass.renderShowHeader()
  $('header').append(headerHtml)
  addShowHeaderListeners()
}

function addShowHeaderListeners(){
  $('.header-logo').parent().click(goHome)
  $('.add-assignment-button').click(addAssignment)
  $('.class-header select').change(switchClass)
  $('.lt-header select').change(switchLt)
  $('.student-header select').change(switchSt)
}

function addAssignment(e){
  clearData()
  getIndexData(forHeader = true)
  getAssignmentFormData()
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
