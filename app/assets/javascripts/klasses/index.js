$(document).ready(function() {
  const array = window.location.href.split("classes/")
  // Checks for the correct show page before running getData()
  if (array.length > 1 && !(array[1].includes("students") || array[1].includes("lts") || array[1].includes("new") || array[1].includes("grades") || array[1].includes("edit"))){
    getData()
    $('.class-header select').change(switchClass)
  }
})

function switchClass(event){
  event.preventDefault()
  const classId = this.value
  if (!classId){
    window.location.href = "http://localhost:3000/classes"
  } else {
    $('main')[0].innerHTML = ''
    klass = undefined
    learningTargets.length = 0
    assignments.length = 0
    students.length = 0
    grades.length = 0
    standards.length = 0
    getData(classId)
    $('.header-logo').parent()[0].href = `http://localhost:3000/classes/${classId}`
    $('header div form')[0].action = `http://localhost:3000/classes/${classId}/assignments/new`
    $('header div form')[1].action = `http://localhost:3000/classes/${classId}/lts/new`
    $('header div form')[2].action = `http://localhost:3000/classes/${classId}/students`


  }

}

function studentAverages(){
  const rows = $('tr')
  for (let i=3; i<rows.length; i++){
    const student = Student.find(Number.parseInt(rows[i].id.split("-")[1]))
    let average = student.average()
    average = average || ""
    $(`tr:nth-child(${i+1}) td.average`)[0].innerHTML = `<p><strong>${average}</strong></p>`
  }
}

function assignmentAverages(){
  const averageTds = $('.assign-average')
  for (let i=0; i<averageTds.length; i++){
    const assignment = Assignment.find(Number.parseInt(averageTds[i].id.split("-")[1]))
    let average = assignment.average()
    average = average || ""
    averageTds[i].innerHTML = `<strong>${average}</strong>`
  }
}


function getData(klassIdFromLink = undefined) {
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    createJSONObjects(json.students, Student)
    createJSONObjects(json.assignments, Assignment)
    createJSONObjects(json.learning_targets, LearningTarget)
    createJSONObjects(json.standards, Standard)
    createJSONGradeObjects(json.grades, Grade)
  })
}

function createJSONObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
}

function createJSONGradeObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
  renderGradebook()
  $('form.grade-input').submit(modifyGrade)
  displayCurrentGrades()
}

function displayCurrentGrades() {
  const gradeTds = $('.score')
  for (let i=0; i<gradeTds.length; i++){
    const grade = Grade.find(gradeTds[i].id)
    gradeTds[i].children[0][1].value = grade.score
    $(gradeTds[i]).keyup(enter_detector)
  }

  studentAverages()
  assignmentAverages()
  conditionalFormatting()

  //adjust LTs in dropdown
  $('.select-lts option:first-child').nextAll().remove()
  $('.select-lts').parent()[0].action = `http://localhost:3000/classes/${klass.id}/learning_targets/redirect`
  learningTargets.forEach(lt => {
    $('.select-lts option:first-child').parent().append(`<option value="${lt.name}">${lt.name}</option>`)
  })

  // //adjust students in dropdown
  $('.select-students option:first-child').nextAll().remove()
  $('.select-students').parent()[0].action = `http://localhost:3000/classes/${klass.id}/students/redirect`
  students.forEach(st => {
    $('.select-students option:first-child').parent().append(`<option value="${st.id}">${st.fullName()}</option>`)
  })
}

function modifyGrade(event){
  event.preventDefault()
  const values = $(this).serialize()
  const klassId = window.location.href.split("/")[4]
  $.ajax({
   type: 'PATCH',
   url: this.action,
   data: JSON.stringify(values)
 }).done(function(data) {
    const grade = Grade.find(data.id)
    grade.update(data)
    grade.colorChange("blue")
    setTimeout(() => grade.colorChangeBack(), 1000)
    studentAverages()
    assignmentAverages()
    conditionalFormatting()
  }).fail(function(data){
    const grade = Grade.find(data.responseJSON.id)
    grade.update(data.responseJSON)
    grade.colorChange("red")
    setTimeout(() => grade.colorChangeBack(), 1000)
  })
}

function enter_detector(e) {
  if(e.which==13||e.keyCode==13){
    $(this).closest('form').submit();
    $(this).children()[0][1].blur()
  }
}
