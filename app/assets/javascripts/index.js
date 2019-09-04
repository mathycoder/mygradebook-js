// consider using onChange instead of enter



$(document).on('turbolinks:load', function() {
  const array = window.location.href.split("classes/")
  // Checks for the correct show page before running getData()
  if (array.length > 1 && !(array[1].includes("students") || array[1].includes("new") || array[1].includes("grades") || array[1].includes("edit"))){
    getData()
    $('form.grade-input').submit(modifyGrade)
  }
})

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
    conditionalFormatting()
    // console.log(data)
    // const oldGrade = grades.find(grade => grade.id === data.id)
    // const td = $(`#${oldGrade.id}`)[0]
    // td.children[0].value = data.score
    })
}

function enter_detector(e) {
// if enter key is pressed lose focus
  if(e.which==13||e.keyCode==13){
    $(this).children()[0].blur()
  }
}
