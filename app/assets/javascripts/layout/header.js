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
  $('.class-header select').change(switchClass)
  $('.lt-header select').change(switchLt)
  $('.student-header select').change(switchSt)
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
