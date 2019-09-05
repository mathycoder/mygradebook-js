// consider using onChange instead of enter
// currently can't resubmit a grade
// currently doesn't return error messages

$(document).on('turbolinks:load', function() {
  const array = window.location.href.split("classes/")
  // Checks for the correct show page before running getData()
  if (array.length > 1 && !(array[1].includes("students") || array[1].includes("new") || array[1].includes("grades") || array[1].includes("edit"))){
    getData()
    $('form.grade-input').submit(modifyGrade)
  }
})

function studentAverages(){
  const rows = $('tr')
  for (let i=3; i<rows.length; i++){
    let average = 0
    const tds = $(`tr:nth-child(${i+1}) td input#grade_score`)
    for (let j=0; j<tds.length; j++){
      average += Number.parseInt(tds[j].value)
    }
    average /= tds.length
    $(`tr:nth-child(${i+1}) td.average`)[0].innerHTML = `<p><strong>${average.toFixed(2)}</strong></p>`
  }
}


function getData() {
  const klassId = window.location.href.split("/")[4]
  $.get('/classes/' + klassId + '/grades', function(json){
    createJSONObjects(json, Grade)
  })
}

function createJSONObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
  displayCurrentGrades()
}

function displayCurrentGrades() {
  const gradeTds = $('.score')
  for (let i=0; i<gradeTds.length; i++){
    const grade = grades.find(grade => grade.id === Number.parseInt(gradeTds[i].id))
    gradeTds[i].children[0].value = grade.score
    $(gradeTds[i]).keyup(enter_detector)
  }
  studentAverages()
  conditionalFormatting()
}

function modifyGrade(event){
  event.preventDefault()
  const values = $(this).serialize()
  const klassId = window.location.href.split("/")[4]
  $.ajax({
   type: 'PATCH',
   url: this.action,
   data: JSON.stringify(values)
 }).done(function(data) {
    $(`#${data.id}.score input`)[0].value = data.score
    $(`#${data.id}.score`).addClass('color-change')
    setTimeout(function() {
      $(`#${data.id}.score`).removeClass('color-change')
      $(`#${data.id}.score`).addClass('change-back')
    }, 1000)
    studentAverages()
    conditionalFormatting()
  }).fail(function(data){
    $(`#${data.responseJSON.id}.score input`)[0].value = data.responseJSON.score
    $(`#${data.responseJSON.id}.score`).addClass('fail-color-change')
    setTimeout(function() {
      $(`#${data.responseJSON.id}.score`).removeClass('fail-color-change')
      $(`#${data.responseJSON.id}.score`).addClass('change-back')
    }, 1000)
  })
}


function enter_detector(e) {
// if enter key is pressed lose focus
  if(e.which==13||e.keyCode==13){
    $(this).closest('form').submit();
    $(this).children()[0].blur()
  }
}
