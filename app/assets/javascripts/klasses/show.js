$().ready(() => {
  $('.class-header select').change(switchClass)
  $('.header-logo').parent().click(goHome)
  if (/^http:\/\/localhost:3000\/classes\/\d$/.test(window.location.href)){
    getKlassData()
  }
})

function getKlassData(klassIdFromLink = undefined) {
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    new Teacher(json.teachers[0])
    createJSONObjects(json.students, Student)
    createJSONObjects(json.assignments, Assignment)
    createJSONObjects(json.learning_targets, LearningTarget)
    createJSONObjects(json.standards, Standard)
    createJSONObjects(json.grades, Grade)
    renderShowPage()
  })
}

function createJSONObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
}

function renderShowPage(){
  $('main').append(klass.formatShow())
  $('form.grade-input').submit(modifyGrade)
  $(`.score`).keyup(enter_detector)
  Student.renderAverages()
  Assignment.renderAverages()
  conditionalFormatting()
  adjustHeader()
  history.pushState(null, null, `http://localhost:3000/classes/${klass.id}`)
}

function enter_detector(e) {
  if(e.which==13||e.keyCode==13){
    $(this).closest('form').submit();
    $(this).children()[0][1].blur()
  }
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
  learningTargets.forEach(lt => $('.select-lts option:first-child').parent().append(`<option value="${lt.name}">${lt.name}</option>`))
  // adjust students in dropdown
  $('.select-students option:first-child')[0].innerText = "Students"
  $('.select-students option:first-child').nextAll().remove()
  $('.select-students').parent()[0].action = `http://localhost:3000/classes/${klass.id}/students/redirect`
  students.forEach(st => $('.select-students option:first-child').parent().append(`<option value="${st.id}">${st.fullName()}</option>`))
}

function modifyGrade(event){
  event.preventDefault()
  const values = $(this).serialize()
  $.ajax({
   type: 'PATCH',
   url: this.action,
   data: JSON.stringify(values)
 }).done(function(data) {
    const grade = Grade.find(data.id)
    grade.update(data)
    grade.colorChange("blue")
    setTimeout(() => grade.colorChangeBack(), 1000)
    currLt ? Student.renderAverages(currLt) : Student.renderAverages()
    Assignment.renderAverages()
    conditionalFormatting()
  }).fail(function(data){
    const grade = Grade.find(data.responseJSON.id)
    grade.update(data.responseJSON)
    grade.colorChange("red")
    setTimeout(() => grade.colorChangeBack(), 1000)
  })
}

function goHome(event){
  event.preventDefault()
  if (window.location.href.split("/")[4]){
    clearData()
    getKlassData()
  }
}

function switchClass(event){
  event.preventDefault()
  const klassId = this.value
  clearData()
  if (!klassId && !teacher) {
    window.location.replace("http://localhost:3000/classes")
  } else if (!klassId){
    $('header')[0].innerHTML = ''
    const headerHtml = Klass.renderIndexHeader()
    $('header').append(headerHtml)
    getIndexData()
  } else {
    getKlassData(klassId)
  }
}

function clearData(){
  klass = undefined
  klasses.length = 0
  learningTargets.length = 0
  assignments.length = 0
  students.length = 0
  grades.length = 0
  standards.length = 0
}
