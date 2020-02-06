$().ready(() => {
  if (/classes\/\d+\/assignments\/\d+\/edit$/.test(window.location.href)){
    console.log("running with JS")
    getIndexData(forHeader = true)
    getAssignmentFormEditData()
  }
})

function getAssignmentFormEditData(klassIdFromLink = undefined, assignmentIdFromLink = undefined){
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  const assignmentId = assignmentIdFromLink || window.location.href.split("/")[6]
  $.get(`/classes/${klassId}/assignments/${assignmentId}/edit.json`, function(json){
    currAssignment = new Assignment(json)
    assignments.pop()
    createJSONObjects(json.grades, Grade)
    getKlassDataAfterAssignment()
  })
}

function getKlassDataAfterAssignment(klassIdFromLink = undefined){
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    new Teacher(json.teachers[0])
    createJSONObjects(json.students, Student)
    createJSONObjects(json.learning_targets, LearningTarget)
    renderAssignmentEditForm()
  })
}

function renderAssignmentEditForm(){
  $('main').append(Assignment.formatAssignmentForm())
  $('.submit-assignment').click(updateAssignment)
  $('.delete-assignment').click(deleteAssignment)
  history.pushState(null, null, `/classes/${klass.id}/assignments/${currAssignment.id}/edit`)
}

function updateAssignment(e){
  e.preventDefault()
  const values = $(this).parent().parent().serialize()
  $.ajax({
  type: 'PATCH',
  url: `/classes/${klass.id}/assignments/${currAssignment.id}`,
  data: JSON.stringify(values)
  }).done(data => {
    $('main')[0].innerHTML = ''
    const klassId = klass.id
    clearData()
    getKlassData(klassId)
    renderFlash("Assignment updated")
 }).fail(data => {
    renderErrorMessages(data.responseJSON)
  })
}

function deleteAssignment(e){
  e.preventDefault()
  $.ajax({
  type: 'DELETE',
  url: `/classes/${klass.id}/assignments/${currAssignment.id}`
  }).done(data => {
    $('main')[0].innerHTML = ''
    const klassId = klass.id
    clearData()
    getKlassData(klassId)
    renderFlash("Assignment deleted")
  })
}

function clickAssignment(e){
  e.preventDefault()
  const klassId = this.href.split('/')[4]
  const assignmentId = this.href.split('/')[6]
  clearData()
  getIndexData(forHeader = true)
  getAssignmentFormEditData(klassId, assignmentId)
}
