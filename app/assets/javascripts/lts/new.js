$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes\/\d+\/lts\/new$/.test(window.location.href)){
    getIndexData(forHeader = true)
    getLtFormData()
  }
})

function getLtFormData(klassIdFromLink = undefined, ltIdFromLink = undefined){
  $('main')[0].innerHTML = ''
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    createJSONObjects(json.learning_targets, LearningTarget)
    renderLtForm()
  })
}

function renderLtForm(){
  $('main').append(LearningTarget.renderForm())
  if (!currLt) { history.pushState(null, null, `http://localhost:3000/classes/${klass.id}/lts/new`)
 }
  requestStandardGradeBands()
}

function requestStandardGradeBands(){
  $.get(`/classes/${klass.id}/lts/new.json`, function(json){
    createJSONObjects(json, Standard)
    populateGradesDropdown()
  })
}

function populateGradesDropdown(){
  Standard.grades().forEach(grade => {
    $('.grade-band').append(`<option ${currLt && currLt.standard().grade === grade ? 'selected="selected"' : ''} value="${grade}">${grade}</option>`)
  })
  $('.grade-band').change(populateGradeStandards)
  $('.submit-lt').click(submitLt)
  if (currLt) { populateGradeStandards() }
}

let originalStandard = true

function populateGradeStandards(){
  const grade = this.value
  const collection = currLt && originalStandard ? [currLt.standard()] : Standard.byGrade(grade)
  $('tbody tr:first-child').nextAll().remove()
  collection.forEach(standard => {
    $('tbody').append(`
      <tr>
        <td>
          <input type="radio" ${currLt && originalStandard ? 'checked="checked"' : ''} value="${standard.id}" name="learning_target[standard_attributes][id]"
        </td>

        <td>
          <label>${standard.standardNotationClean()}</label>
        </td>

        <td>
          ${standard.description}
        </td>
      </tr>
      `)
  })
  originalStandard = false
}

function submitLt(e){
  e.preventDefault()
  const values = $('.lt-form').serialize()
  if (!currLt) {
    $.post(`/classes/${klass.id}/lts`, values)
      .done(data => {
        $('main')[0].innerHTML = ''
        const klassId = klass.id
        clearData()
        getKlassData(klassId)
        renderFlash("New Learning Target created")
     }).fail(data => {
        renderErrorMessages(data.responseJSON)
     })
  } else {
    $.ajax({
    type: 'PATCH',
    url: `/classes/${klass.id}/lts/${currLt.id}`,
    data: values
    }).done(data => {
      $('main')[0].innerHTML = ''
      const klassId = klass.id
      clearData()
      getKlassData(klassId)
      renderFlash("Learning Target updated")
   }).fail(data => {
      renderErrorMessages(data.responseJSON)
    })
  }

}
