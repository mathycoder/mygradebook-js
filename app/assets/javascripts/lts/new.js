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
    $('.grade-band').append(`<option value="${grade}">${grade}</option>`)
  })
  $('.grade-band').change(populateGradeStandards)
}

function populateGradeStandards(){
  const grade = this.value
  const standardsByGrade = Standard.byGrade(grade)
  $('tbody tr:first-child').nextAll().remove()
  standardsByGrade.forEach(standard => {
    $('tbody').append(`
      <tr>
        <td>
          <input type="radio" value="${standard.id}" name="learning_target[standard_attributes][${standard.id}]"
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
}
