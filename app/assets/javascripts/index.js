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
        <tbody>
        </tbody>
      </table>
    </div>`

  // creates first row: gradebook title and learning targets
  $('tbody').append(`<tr></tr>`)
  $('tbody tr').append('<th rowspan="2"></th>')
  $('tbody tr th').append(`
    <div class="gradebook-title">
      <div id="gradebook-details">
        <h2>
          <strong>${klass.name}'s Gradebook</strong><br>
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

    $('tbody tr').append('<th></th>')

    learningTargets.forEach(target => {
      $('tbody tr').append(`
        <th colspan="${target.assignments().length}" class="start-of-lt ${target.colorClass()}">
          <div class="lt-target-label-container">
            <a href="/classes/${klass.id}/lts/${target.id}">
              ${learningTargets[0].standard().alt_standard_notation}<br>
              ${target.name}
            </a> <br>
            <div class="assignment-label">Assignments</div>
          </div>
        </th>`)
    })


    // creates second row: assignments
    $('tbody').append(`
      <tr>
        <td></td>
      </tr>`)

    learningTargets.forEach(lt => {
      if (lt.assignments().length === 0) {$('.gradebook tr:last-child').append(`<td></td>`)}
      lt.chronologicalAssignments().forEach((assignment, index) => {
        $('.gradebook tr:last-child').append(`
          <td id="assignment-${assignment.id}" class="assignments ${(index===0) ? 'start-of-lt' : ''}">
            <a href="/classes/${klass.id}/assignments/${assignment.id}/edit">
              <div class="assignment-header">
                <div>${assignment.name}</div>
                <div class="date">${assignment.dateDisplay()}</div>
              </div>
            </a>
          </td>
          `)
      })
    })

    // assignment averages row
    $('tbody').append(`<tr></tr>`)
    $('.gradebook tr:last-child').append(`
      <td>
        <div>
          <strong>Students</strong>
          <span onclick="rowSorter('highest', 'name')" class="arrow"> 	&#x2B06 </span>
          <span onclick="rowSorter('lowest', 'name')" class="arrow"> 	&#x2B07 </span>
        </div>
      </td>

      <td>
        <div>
          <strong> Average </strong>
          <span onclick="rowSorter('highest', 'average')" class="arrow"> 	&#x2B06 </span>
          <span onclick="rowSorter('lowest', 'average')" class="arrow"> 	&#x2B07 </span>
        </div>
      </td>
      `)

      learningTargets.forEach(lt => {
        if (lt.assignments().length === 0) {
          $('.gradebook tr:last-child').append(`<td></td>`)
        }

        lt.chronologicalAssignments().forEach((assignment, index) => {
          $('.gradebook tr:last-child').append(`
            <td id="assignment-${assignment.id}" class="${index === 0 ? 'start-of-lt' : ''} assignment-averages assign-average">
              <div><strong></strong></div>
            </td>
            `)
        })
      })

      // student rows
      Student.byLastName().forEach(student => {
        $('tbody').append(`
          <tr id="student-${student.id}">
            <td class="student-name">
              <a href="/classes/${klass.id}/students/${student.id}">
                <div class="student-column">
                  ${student.fullName()}
                </div>
              </a>
            </td>

            <td class="average assignment-averages">
              <p>
                <strong></strong>
              </p>
            </td>
          </tr>
          `)

        learningTargets.forEach(lt => {
          if (lt.assignments().length === 0) {$('tbody tr:last-child').append(`<td></td>`)}

          


        })
      })
}


// <% klass.students_by_last_name.each do |student| %>
//   <%= content_tag(:tr, id: "student-#{student.id}") do %>
//     <%= td_link_to_student(klass, student) %>
//     <%= td_student_average(student, klass_or_lt) %>
//
//     <% collection.each do |lt| %>
//       <%= blank_td?(lt) %>
//         <% lt.students_chronological_grades(student).each_with_index do |grade, index| %>
//           <%= content_tag(:td, class: td_classes(index, ["score","col-#{index}"]), id: "#{grade.id}") do %>
//             <%= form_for(:grade, url: klass_grade_path(klass, grade), html: {class: "grade-input"}) do |f| %>
//               <%= f.text_field(:score, class: "grade-text-field") %>
//               <%= f.hidden_field(:id, :value => grade.id) %>
//             <% end %>
//           <% end %>
//         <% end %>
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
      createJSONObjects(json.standards, Standard)
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
