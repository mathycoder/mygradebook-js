$().ready(() => {
  if (/classes\/\d+\/lts\/\d+\/edit/.test(window.location.href)){
    getIndexData(forHeader = true)
    getKlassLtEditFormData()
  }
})

function getKlassLtEditFormData(klassIdFromLink = undefined, ltIdFromLink = undefined){
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    createJSONObjects(json.learning_targets, LearningTarget)
    getLtEditFormData(klassId, ltIdFromLink)
  })
}

function getLtEditFormData(klassId, ltIdFromLink){
  const ltId = ltIdFromLink || window.location.href.split("/")[6]
  $.get(`/classes/${klassId}/lts/${ltId}.json`, function(json){
    currLt = new LearningTarget(json)
    learningTargets.pop()
    renderLtForm()
    history.pushState(null, null, `/classes/${klass.id}/lts/${currLt.id}/edit`)
    $('.delete-lt').click(deleteLtButton)
  })
}

function deleteLtButton(e){
  e.preventDefault()
  $.ajax({
  type: 'DELETE',
  url: `/classes/${klass.id}/lts/${currLt.id}`
  }).done(data => {
    $('main')[0].innerHTML = ''
    const klassId = klass.id
    clearData()
    getKlassData(klassId)
    renderFlash("Learning Target deleted")
  })
}
