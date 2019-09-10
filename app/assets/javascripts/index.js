$(document).ready(function() {
  const array = window.location.href.split("classes/")
  // Checks for the correct show page before running getData()
  if (array.length > 1 && !(array[1].includes("students") || array[1].includes("lts") || array[1].includes("new") || array[1].includes("grades") || array[1].includes("edit"))){
    getData()
    $('form.grade-input').submit(modifyGrade)

  }
})

// Okay, we're trying to render the whole page with JS!
// Here's where I try to do that!


function renderGradebook(){
  // sets up table layout
  document.querySelector('main').innerHTML = `
    <div class="gradebook-wrapper">
      <table class="gradebook">
      </table>
    </div>`

  // creates first row: gradebook title and learning targets
  $('.gradebook').append(`<tr></tr>`)
  $('.gradebook tr').append('<th rowspan="2"></th>')
  $('.gradebook tr th').append(`
    <div class="gradebook-title">
      <div id="gradebook-details">
        <h2>
          <strong>
            ${klass.name}'s Gradebook<br>
          </strong>
        </h2>
        <div id="class-details">
          <strong>Subject: </strong> ${klass.subject}
          <strong>Grade: </strong> ${klass.grade}
          <strong>Period: </strong> ${klass.period}
          <br><br>
        </div>
      </div>
      <div id="book-logo">
        <img src="/assets/open-book2.png">
      </div>
    </div>`)

    learningTargets.forEach(target => {
      $('.gradebook tr').append(`
        <th colspan="${target.assignments().length}" class="start-of-lt ${target.colorClass()}">
          <div class="lt-target-label-container">
            <a href="/classes/${klass.id}/lts/${target.id}">${target.name}</a> <br>
            <div class="assignment-label">Assignments</div>
          </div>
        </th>`)
    })


    // creates second row: assignments
    $('.gradebook').append(`
      <tr>
        <td></td>
      </tr>`)

    learningTargets.forEach(lt => {
      if (lt.assignments().length === 0) {$('.gradebook tr:last-child').append(`<td></td>`)}
      lt.chronologicalAssignments().forEach((assignment, index) => {
        $('.gradebook tr:last-child').append(`
          <td id="assignment-${assignment.id}" class="assignments ${(index===0) ? 'start-of-lt' : ''}">
            Display Assignment and Date
          </td>
          `)

      })

    })

    $('.gradebook tr:last-child').append(``)

}

// def td_classes(index, initial_class=nil)
//   array = [initial_class]
//   array << "start-of-lt" if index == 0
//   array
// end


    // <%= content_tag(:tr) do %>
    //   <%= tag(:td) %>
    //   <% collection.each do |lt| %>
    //     <%= content_tag(:td) if lt.assignments.empty? %>
    //     <% lt.chronological_assignments.each_with_index do |assignment, index| %>
    //       <%= content_tag(:td, id: "assignment-#{assignment.id}", class: td_classes(index, "assignments")) do %>
    //         <%= display_assignment_and_date(klass, assignment) %>
    //       <% end %>
    //     <% end %>
    //   <% end %>
    // <% end %>










function studentAverages(){
  const rows = $('tr')
  for (let i=3; i<rows.length; i++){
    const student = Student.find(Number.parseInt(rows[i].id.split("-")[1]))
    let average = student.average()
    average = average || ""
    $(`tr:nth-child(${i+1}) td.average`)[0].innerHTML = `<p><strong>${average}</strong></p>`
  }
}

function assignmentAverages(){
  const averageTds = $('.assign-average')
  for (let i=0; i<averageTds.length; i++){
    const assignment = Assignment.find(Number.parseInt(averageTds[i].id.split("-")[1]))
    let average = assignment.average()
    average = average || ""
    averageTds[i].innerHTML = `<strong>${average}</strong>`
  }
}


function getData() {
  // klass show page
  const klassId = window.location.href.split("/")[4]
  if (!window.location.href.includes("lts")){
    $.get(`/classes/${klassId}.json`, function(json){
      klass = new Klass(json)
      createJSONObjects(json.students, Student)
      createJSONObjects(json.assignments, Assignment)
      createJSONObjects(json.learning_targets, LearningTarget)
      createJSONGradeObjects(json.grades, Grade)
    })
    // lt show page
  } else {
      const ltId = window.location.href.split("/")[6]
      $.get(`/classes/${klassId}/lts/${ltId}.json`, function(json){
        createJSONObjects(json.students, Student)
        createJSONGradeObjects(json.grades, Grade)
      })
  }
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
  renderGradebook()
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
