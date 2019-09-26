$().ready(() => {
  $('.lt-header select').change(switchLt)
  if (/^http:\/\/localhost:3000\/classes\/\d+\/lts\/\d+$/.test(window.location.href)){
    getIndexData(forHeader = true)
    getLtData()
  }
})

function getLtData(klassIdFromLink = undefined, ltIdFromLink = undefined){
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  const ltId = ltIdFromLink || window.location.href.split("/")[6]
  $.get(`/classes/${klassId}/lts/${ltId}.json`, function(json){
    currLt = new LearningTarget(json)
    learningTargets.pop()
    getKlassDataAfterLt()
  })
}

function getKlassDataAfterLt(klassIdFromLink = undefined){
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    new Teacher(json.teachers[0])
    createJSONObjects(json.students, Student)
    createJSONObjects(json.assignments, Assignment)
    createJSONObjects(json.learning_targets, LearningTarget)
    createJSONObjects(json.standards, Standard)
    createJSONObjects(json.grades, Grade)
    renderLtShowPage()
  })
}

function renderLtShowPage(){
  $('main').append(currLt.formatShow())
  $('.lt-show-gradebook').append(klass.formatShow(currLt))
  $('form.grade-input').submit(modifyGrade)
  $(`.score`).keyup(enter_detector)
  $('.link-edit-lt').click(editLt)
  Student.renderAverages(currLt)
  Assignment.renderAverages()
  conditionalFormatting()
  currLt.lineChart()
  history.pushState(null, null, `http://localhost:3000/classes/${klass.id}/lts/${currLt.id}`)
  adjustHeader()
  $(`.lt-header option[value='${currLt.id}'`)[0].selected = "selected"
  $('.student-column').parent().click(clickStudent)
}

function switchLt(event){
  event.preventDefault()
  const ltId = this.value
  const klassId = window.location.href.split("/")[4]
  if (ltId){
    clearData()
    getLtData(klassId, ltId)
  }
}

function clickLt(event){
  event.preventDefault()
  const klassId = this.href.split('/')[4]
  const ltId = this.href.split('/')[6]
  const lt = LearningTarget.find(ltId)
  clearData()
  getLtData(klassId, ltId)
}

function editLt(event){
  event.preventDefault()
  getIndexData(forHeader = true)
  originalStandard = true
  getKlassLtEditFormData(klass.id, currLt.id)
}
