$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes\/\d\/assignments\/new$/.test(window.location.href) || /^http:\/\/localhost:3000\/classes\/\d\/assignments\/new\?utf8\=%E2%9C%93&commit\=%2BA$/.test(window.location.href)){
    getIndexData(forHeader = true)
    getAssignmentFormData()
  }
})

function getAssignmentFormData(klassIdFromLink = undefined, assignmentIdFromLink = undefined){
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  //const assignmentId = assignmentIdFromLink || window.location.href.split("/")[6]
  $.get(`/classes/${klassId}/assignments/new.json`, function(json){
    klass = new Klass(json)
    createJSONObjects(json.students, Student)
    createJSONObjects(json.learning_targets, LearningTarget)
    renderAssignmentForm()
  })
}

function renderAssignmentForm(){
  $('main').append(Assignment.formatAssignmentForm())
  $('.big-button').parent().submit(submitAssignment)
}

function submitAssignment(e){
  e.preventDefault()
  const values = $(this).serialize()
  alert("submitting via ajax")
  $.post(this.action, JSON.stringify(values))
    .done(data => {
      $('main')[0].innerHTML = ''
      const klassId = klass.id
      clearData()
      getKlassData(klassId)
   })
}
