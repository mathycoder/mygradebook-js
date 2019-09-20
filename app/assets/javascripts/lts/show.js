$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes\/\d\/lts\/\d$/.test(window.location.href)){
    let currLt
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
  Student.renderAverages(currLt)
  Assignment.renderAverages()
  conditionalFormatting()
  currLt.lineChart()
}