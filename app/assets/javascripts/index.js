// currently doesn't return error messages

$(document).ready(function() {
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
    let counter = 0
    for (let j=0; j<tds.length; j++){
      const num = Number.parseFloat(tds[j].value)
      if (num){
        average += num
        counter++
      }
    }
    average /= counter
    if (average) {
      $(`tr:nth-child(${i+1}) td.average`)[0].innerHTML = `<p><strong>${average.toFixed(2)}</strong></p>`
    } else {
      $(`tr:nth-child(${i+1}) td.average`)[0].innerHTML = `<p><strong></strong></p>`
    }
  }
}

function assignmentAverages(){
  const columns = $('tr:nth-child(3) td')
  for (let i=2; i<columns.length; i++){
    let average = 0
    const tds = $(`tr:nth-child(n+4) td:nth-child(${i+1}) input#grade_score`)
    let counter = 0
    for (let j=0; j<tds.length; j++){
      const num = Number.parseFloat(tds[j].value)
      if (num){
        average += num
        counter++
      }
    }
    average /= counter
    if (average) {
      $('.assign-average')[i-2].innerHTML = `<strong>${average.toFixed(2)}</strong>`
    } else {
      $('.assign-average')[i-2].innerHTML = `<strong></strong>`
    }

  }
}


function getData() {
  const klassId = window.location.href.split("/")[4]

  $.get('/classes/' + klassId + '.json', function(json){
    createJSONObjects(json.students, Student)
  })


  $.get('/classes/' + klassId + '/grades', function(json){
    createJSONGradeObjects(json, Grade)
  })

}

function createJSONObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
}

function createJSONGradeObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
  displayCurrentGrades()
}

function displayCurrentGrades() {
  const gradeTds = $('.score')
  for (let i=0; i<gradeTds.length; i++){
    const grade = Grade.find(gradeTds[i].id)
    gradeTds[i].children[0][2].value = grade.score
    $(gradeTds[i]).keyup(enter_detector)
  }

  studentAverages()
  assignmentAverages()
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
    const grade = Grade.find(data.id)
    grade.update(data)
    grade.colorChange("blue")
    setTimeout(() => grade.colorChangeBack(), 1000)
    studentAverages()
    assignmentAverages()
    conditionalFormatting()
  }).fail(function(data){
    const grade = Grade.find(data.responseJSON.id)
    grade.update(data.responseJSON)
    grade.colorChange("red")
    setTimeout(() => grade.colorChangeBack(), 1000)
  })
}

function enter_detector(e) {
  if(e.which==13||e.keyCode==13){
    $(this).closest('form').submit();
    $(this).children()[0][2].blur()
  }
}
