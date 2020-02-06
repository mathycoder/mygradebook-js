$().ready(() => {
  if (/classes\/\d+\/assignments\/new$/.test(window.location.href) || /classes\/\d+\/assignments\/new\?utf8\=%E2%9C%93&commit\=%2BA$/.test(window.location.href)){
    getIndexData(forHeader = true)
    getAssignmentFormData()
  }
})

function getAssignmentFormData(klassIdFromLink = undefined, assignmentIdFromLink = undefined){
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}/assignments/new.json`, function(json){
    klass = new Klass(json)
    createJSONObjects(json.students, Student)
    createJSONObjects(json.learning_targets, LearningTarget)
    renderAssignmentForm()
  })
}

function renderAssignmentForm(){
  $('main').append(Assignment.formatAssignmentForm())
  $('.submit-assignment').click(submitAssignment)
  history.pushState(null, null, `http://localhost:3000/classes/${klass.id}/assignments/new`)
}

function submitAssignment(e){
  e.preventDefault()
  console.log("creating new record")
  const values = $(this).parent().parent().serialize()
  $.post($(this).parent().parent()[0].action, JSON.stringify(values))
    .done(data => {
      $('main')[0].innerHTML = ''
      const klassId = klass.id
      clearData()
      getKlassData(klassId)
      renderFlash("New Assignment created")
   }).fail(data => {
      renderErrorMessages(data.responseJSON)
    })
}

function renderErrorMessages(array){
  $('.error-messages ul').children().remove()
  array.forEach(message => {
    $('.error-messages ul').append(`<li style="color: red">${message}</li>`)
  })
}
