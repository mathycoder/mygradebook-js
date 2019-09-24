$().ready(() => {
  $('.student-header select').change(switchSt)
  if (/http:\/\/localhost:3000\/classes\/\d\/students\/\d/.test(window.location.href)){
    getIndexData(forHeader = true)
    getStudentShowData()
  }
})

function getStudentShowData(klassIdFromLink = undefined, stIdFromLink = undefined){
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  const stId = stIdFromLink || window.location.href.split("/")[6]
  $.get(`/classes/${klassId}/students/${stId}.json`, function(json){
    currStudent = new Student(json)
    students.pop()
    getKlassDataAfterStudent(klassId)
  })
}

function getKlassDataAfterStudent(klassId){
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    new Teacher(json.teachers[0])
    createJSONObjects(json.students, Student)
    createJSONObjects(json.assignments, Assignment)
    createJSONObjects(json.learning_targets, LearningTarget)
    createJSONObjects(json.standards, Standard)
    createJSONObjects(json.grades, Grade)
    renderStudentShowPage()
  })
}

function renderStudentShowPage(){
  $('main').append(currStudent.formatShow())
  currStudent.summaryChart()
  learningTargets.forEach(lt => lt.lineChart(currStudent))
  history.pushState(null, null, `http://localhost:3000/classes/${klass.id}/students/${currStudent.id}`)
  adjustHeader()
  $(`.student-header option[value='${currStudent.id}'`)[0].selected = "selected"
  $('.lt-target-label a').click(clickLt)
}

function switchSt(event){
  event.preventDefault()
  const stId = this.value
  const klassId = window.location.href.split("/")[4]
  if (stId){
    clearData()
    getStudentShowData(klassId, stId)
  }
}

function clickStudent(event){
  event.preventDefault()
  const klassId = this.href.split('/')[4]
  const stId = this.href.split('/')[6]
  clearData()
  getStudentShowData(klassId, stId)
}
