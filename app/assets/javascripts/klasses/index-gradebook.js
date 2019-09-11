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
              ${target.standard().standardNotationClean()}<br>
              ${target.name}
            </a>
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

          lt.studentsChronologicalGrades(student).forEach((grade, index) =>{
            $('tbody tr:last-child').append(`
              <td id="${grade.id}" class="score col-${index} ${index === 0 ? 'start-of-lt' : ''}">
                <form class="grade-input" method="GET" action="/classes/${klass.id}/grades/${grade.id}">
                  <input name="utf8" type="hidden" value="✓"
                  <input name="hidden" name="authenticity_token" value="">
                  <input type="text" class="grade-text-field" name="grade[score]" id="grade_score">
                  <input type="hidden" name="grade[id]" value="${grade.id}" id="grade_id">
                </form>
              </td>
              `)
          })
        })
      })
}
