const klasses = []
let klass
class Klass {
  constructor(attributes){
    this.id = attributes.id
    this.name = attributes.name
    this.subject = attributes.subject
    this.grade = attributes.grade
    this.period = attributes.period
    this.learningTargets = []
    this.standards = []
    this.students = []
    this.assignments = []
    this.grades = []
    klass = this
  }

  formatShow(){
    let html = ''
    html += `
      <div class="gradebook-wrapper">
        <table class="gradebook">
          <tbody>
            <tr>
              <th rowspan="2">
                <div class="gradebook-title">
                  <div id="gradebook-details">
                    <h2>
                      <strong>${this.name}'s Gradebook</strong><br>
                    </h2>
                    <div id="class-details">
                      <strong>Subject: </strong> ${this.subject}
                      <strong>Grade: </strong> ${this.grade}
                      <strong>Period: </strong> ${this.period}
                      <br><br>
                    </div>
                  </div>
                  <div id="book-logo">
                    <img src="/assets/open-book2.png">
                  </div>
                </div>
              </th>
              <th></th>
              ${this.learningTargetHeadersHtml()}
            </tr>
            <tr>
              <td></td>
              ${this.assignmentHeadersHtml()}
            </tr>

            <tr>
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
              ${this.assignmentAveragesHtml()}
            </tr>
            ${this.studentRowsHtml()}
              `
      html += `
            </tr>
          </tbody>
        </table>
      </div>`

      return html
  }

  learningTargetHeadersHtml(){
    let html = ''
    learningTargets.forEach(target => {
      html += `
        <th colspan="${target.assignments().length}" class="start-of-lt ${target.colorClass()}">
          <div class="lt-target-label-container">
            <a href="/classes/${this.id}/lts/${target.id}">
              ${target.standard().standardNotationClean()}<br>
              ${target.name}
            </a>
            <div class="assignment-label">Assignments</div>
          </div>
        </th>`
      })
      return html
  }

  assignmentHeadersHtml(){
    let html = ''
    learningTargets.forEach(lt => {
      if (lt.assignments().length === 0) {html += `<td></td>`}
      lt.chronologicalAssignments().forEach((assignment, index) => {
        html += `
          <td id="assignment-${assignment.id}" class="assignments ${(index===0) ? 'start-of-lt' : ''}">
            <a href="/classes/${this.id}/assignments/${assignment.id}/edit">
              <div class="assignment-header">
                <div>${assignment.name}</div>
                <div class="date">${assignment.dateDisplay()}</div>
              </div>
            </a>
          </td>
          `
      })
    })
    return html
  }

  assignmentAveragesHtml(){
    let html = ''
    learningTargets.forEach(lt => {
      if (lt.assignments().length === 0) {
        html += `<td></td>`
      }

      lt.chronologicalAssignments().forEach((assignment, index) => {
        html += `
          <td id="assignment-${assignment.id}" class="${index === 0 ? 'start-of-lt' : ''} assignment-averages assign-average">
            <div><strong></strong></div>
          </td>
          `
      })
    })
    return html
  }

  studentRowsHtml(){
    let html = ''
    Student.byLastName().forEach(student => {
      html += `
        <tr id="student-${student.id}">
          <td class="student-name">
            <a href="/classes/${this.id}/students/${student.id}">
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
        `

      learningTargets.forEach(lt => {
        if (lt.assignments().length === 0) {html += `<td></td>`}

        lt.studentsChronologicalGrades(student).forEach((grade, index) =>{
          html += `
            <td id="${grade.id}" class="score col-${index} ${index === 0 ? 'start-of-lt' : ''}">
              <form class="grade-input" method="GET" action="/classes/${this.id}/grades/${grade.id}">
                <input name="utf8" type="hidden" value="✓"
                <input name="hidden" name="authenticity_token" value="">
                <input type="text" class="grade-text-field" name="grade[score]" id="grade_score" value="${grade.score || ''}">
                <input type="hidden" name="grade[id]" value="${grade.id}" id="grade_id">
              </form>
            </td>
            `
        })
      })
    })
    return html
  }
}
