$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes\/\d+\/lts\/\d+\/edit/.test(window.location.href)){
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
  })
}
