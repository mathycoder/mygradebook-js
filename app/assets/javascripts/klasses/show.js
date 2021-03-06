$().ready(() => {
  $('.class-header select').change(switchClass)
  if (/classes\/\d+$/.test(window.location.href)){
    getIndexData(forHeader = true)
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
    if (learningTargets.length === 0 ) {
      window.location.replace(`/classes/${klass.id}/lts`)
    } else {
      renderShowPage()
    }
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
  $('.lt-target-label-container a').click(clickLt)
  $('.student-name a').click(clickStudent)
  $('.assignments a').click(clickAssignment)
  Student.renderAverages()
  Assignment.renderAverages()
  conditionalFormatting()
  adjustHeader()
  history.pushState(null, null, `/classes/${klass.id}`)
  $(`.class-header option[value='${klass.id}'`)[0].selected = "selected"
}

function enter_detector(e) {
  if(e.which==13||e.keyCode==13){
    $(this).closest('form').submit();
    $(this).children()[0][1].blur()
  }
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

function switchClass(event){
  event.preventDefault()
  const klassId = this.value
  clearData()
  if (!klassId && !teacher) {
    window.location.replace("http://localhost:3000/classes")
  } else if (!klassId){
    renderIndexHeader()
    getIndexData()
  } else {
    getKlassData(klassId)
  }
}

function clearData(){
  klass = undefined
  currLt = undefined
  currAssignment = undefined
  klasses.length = 0
  learningTargets.length = 0
  assignments.length = 0
  students.length = 0
  grades.length = 0
  standards.length = 0
}
