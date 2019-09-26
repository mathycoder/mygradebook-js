const students = []
let currStudent
class Student {
  constructor(attributes){
    this.id = attributes.id
    this.first_name = attributes.first_name
    this.last_name = attributes.last_name
    this.grade = attributes.grade
    this.klass = attributes.klass
    students.push(this)
  }

  fullName(){
    return `${this.last_name}, ${this.first_name}`
  }

  static byLastName(){
    return students.sort((a,b) => a.last_name.localeCompare(b.last_name))
  }

  static renderAverages(lt = undefined){
    const rows = $('tr')
    for (let i=3; i<rows.length; i++){
      const student = Student.find(Number.parseInt(rows[i].id.split("-")[1]))
      let average = (lt ? student.average(lt) : student.average())
      average = average || ""
      $(`tr:nth-child(${i+1}) td.average`)[0].innerHTML = `<p><strong>${average}</strong></p>`
    }
  }

  average(lt = undefined){
    let myGrades = grades.filter(grade => grade.student_id === this.id && grade.score)
    if (lt) { myGrades = myGrades.filter(grade => grade.assignment().learningTarget().id === lt.id) }
    const sum = myGrades.reduce((acc, grade) => acc + Number.parseFloat(grade.score), 0)
    if (sum === 0) { return undefined }
    return (sum / myGrades.length).toFixed(2)
  }

  grades(){
    return grades.filter(grade => grade.student_id === this.id && grade.score)
  }

  static find(studentId){
    return students.find(student => studentId === student.id)
  }

  static inKlass(student){
    return students.includes(student)
  }

  static displayStudentsInDOM(){
    students.forEach(student => $('table').append(student.fullTrHTML()))
  }

  static resetFormFields(){
    $('.new-student-form')[0].reset()
  }

  update(data){
    this.first_name = data.first_name
    this.last_name = data.last_name
    this.grade = data.grade
    this.klass = data.klass
  }

  trHTML(){
    return `<td>${this.last_name}</td>
            <td>${this.first_name}</td>
            <td>${this.grade}</td>
            <td>${this.klass}</td>
            <td><button id="edit-${this.id}" class="little-button edit-student-button">edit</button></td>
            <td><button id="delete-${this.id}" class="little-button delete-student-button">delete</button></td>`
  }

  fullTrHTML(){
    return `<tr id="student-${this.id}">
              <td>${this.last_name}</td>
              <td>${this.first_name}</td>
              <td>${this.grade}</td>
              <td>${this.klass}</td>
              <td><button id="edit-${this.id}" class="little-button edit-student-button">edit</button></td>
              <td><button id="delete-${this.id}" class="little-button delete-student-button">delete</button></td>
            </tr>`
  }

  fullTrInSchoolHTML(){
    return `<tr id="student-${this.id}">
              <td><button id="add-${this.id}" class="little-button add-student-button">Add</button></td>
              <td>${this.last_name}</td>
              <td>${this.first_name}</td>
              <td>${this.grade}</td>
              <td>${this.klass}</td>
            </tr>`
  }

  fullTrInKlassHTML(){
    return `<tr id="student-${this.id}">
              <td><button id="add-${this.id}" class="little-button remove-student-button">Remove</button></td>
              <td>${this.last_name}</td>
              <td>${this.first_name}</td>
              <td>${this.grade}</td>
              <td>${this.klass}</td>
            </tr>`
  }

  addTrToDOM(){
    $('#student-list-header').after(this.fullTrHTML())
  }

  updateTrOnDOM(){
    $(`#student-${this.id}`)[0].innerHTML = this.trHTML()
  }

  fillForm(){
    $('#text-field-first-name')[0].value = this.first_name
    $('#text-field-last-name')[0].value = this.last_name
    $('#text-field-grade')[0].value = this.grade
    $('#text-field-klass')[0].value = this.klass
  }

  addClickEvents(){
    $(`#student-${this.id} .delete-student-button`).click(deleteStudent)
    $(`#student-${this.id} .edit-student-button`).click(editStudent)
  }

  formatShow(){
    let html = ''
    html += `
      <h1>${this.first_name} ${this.last_name}</h1>
      <div class="student-show-container">
        <div id="student-summary-graph" class="student-show-studentbox">
          <div id="student-summary-chart" style="height: 300px; width: 400px;"></div>
        </div>

        <div class="student-show averages">
          <div class="rubric-title"><strong>Student Stats</strong></div>
          <div>Overall Grade </div>
          <div><strong>${this.average()}</strong></div>
          <div>level 3 and up<br>Assignments</div>
          <div><strong>${this.percentOfAssignmentsOnLevel(3.0)}</strong></div>
          <div>level 2<br>Assignments </div>
          <div><strong>${this.percentOfAssignmentsOnLevel(2.0)}</strong></div>
          <div>level 1<br>Assignments</div>
          <div><strong>${this.percentOfAssignmentsOnLevel(1.0)}</strong></div>
        </div>
    `

    learningTargets.forEach(lt => {
      html += `
      <div class="student-show-gradebook-container">
        <table class="gradebook">
          <tr>
            <th colspan="${lt.assignments().length}" class="${lt.colorClass()} start-of-lt">
              <div class="lt-target-label-container">
                <div class="lt-target-label">
                  ${lt.standard().standardNotationClean()}<br>
                  <a href="/classes/${klass.id}/lts/${lt.id}">${lt.name}</a>
                  <br>
                </div>
                <div class="assignment-label">
                  Assignments
                </div>
              </div>
            </th>
          </tr>
          <tr>
            ${lt.assignments().length === 0 ? '<td></td>' : ''}`

            lt.chronologicalAssignments().forEach((assignment, index) => {
              html += `
                <td class="assignments ${index === 0 ? "start-of-lt" : ""}">
                  <div class="assignment-header">
                    <div>
                      <a href="/classes/${klass.id}/assignments/${assignment.id}/edit">${assignment.name}</a>
                    </div>
                    <div class="date">${assignment.dateDisplay()}</div>
                  </div>
                </td>
              `
            })
          html += `
          </tr>
          <tr>
            ${lt.assignments().length === 0 ? '<td class="start-of-lt"></td>' : ''}
            `

            lt.studentsChronologicalGrades(this).forEach((grade, index) => {
              html += `
                <td class="score ${index === 0 ? 'start-of-lt' : ''}">
                  ${grade.score ? grade.score : ''}
                </td>
              `
            })

          html += `
          </tr>
        </table>
      </div>

      <div class="student-show-lt-graph">
        <div id="chart-${lt.id}" style="height: 300px; width: 400px;"></div>
      </div>
          `
    })

    html += `</div>`
    return html
  }

  summaryChart(){
    new Chartkick.ColumnChart("student-summary-chart", this.summaryChartData(), {
                              min: 0, max: 4,
                              ytitle: "Average", messages: {empty: "No data"},
                              colors: this.studentBarGraphColors(),
                              library: { scales: { yAxes: [{ gridLines: { display: true },ticks: { maxTicksLimit: 5 } }]}}
                          })
  }

  summaryChartData(){
    let data = learningTargets.map(lt => {
      return {name: lt.name, data: {"Learning Targets": lt.studentAverage(this)}}
    })
    return data
  }

  studentBarGraphColors(){
    const colors = ["rgb(217, 106, 94)", "rgb(85, 170, 104)", "rgb(71, 125, 179)"]
    let graphColors = []
    for (let i=0; i<learningTargets.length; i++){
      graphColors.push(colors[i % 3])
    }
    return graphColors
  }

  percentOfAssignmentsOnLevel(level){
    const levelUp = (level === 3.0? 1.1 : 1.0)
    let scores = this.grades().map(grade => grade.score)
    scores = scores.filter(score => score!==undefined)
    const targetScores = scores.filter(score => score >= level && score < (level + levelUp))
    let percentage = (targetScores.length / scores.length)*100
    return `${percentage.toFixed(1)}%`
  }

  static renderIndexPage(){
    let html = ''
    html += `
      <div id="new-students-title">
        <div>
          <h1>Students in the School</h1>
        </div>
      </div>

      <div class="student-list-container">
        <div class="paper-form">
          <h2 id="add-student-header">Add Student</h2>
          <form class="new-student-form" action="/students/new" accept-charset="UTF-8" method="POST">
            <input name="utf8" type="hidden" value="✓">
            <input maxlength="20" class="text-field" id="text-field-first-name" placeholder="First Name" size="20" type="text" name="student[first_name]">
            <br><br>
            <input maxlength="20" class="text-field" id="text-field-last-name" placeholder="Last Name" size="20" type="text" name="student[last_name]">
            <br><br>
            <input maxlength="4" class="text-field" id="text-field-grade" placeholder="Grade" size="4" type="text" name="student[grade]">
            <br><br>
            <input maxlength="5" class="text-field" id="text-field-klass" placeholder="Homeroom" size="5" type="text" name="student[klass]">
            <br><br><br>
            <div>
              <button class="big-button">Save Student</button>
            </div>
          </form>
        </div>

        <div class="students-in-school paper-form">
          <h3>Students in the school</h3>
          <form class="filter-form" action="/students/new" accept-charset-"UTF-8" method="get">
            <input name="utf8" type="hidden" value="✓">
            <input type="text" name="query" id="query" placeholder="Filter by name or class">
            <input type="submit" name="commit" value="Filter" class="filter-button little-button" data-disable-with="Filter">
            <button class="little-button sort-by-name">Sort</button>
          </form>
          <br>
          <div class="listed-students">
            <table>
              <tbody>
                <tr id="student-list-header">
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Grade</th>
                  <th>HR</th>
                  <th></th>
                  <th></th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      `
    return html
  }

  static formatIndexPage(){
    let html = ''
    html += `
      <div>
        <h1>Add Students to Class ${klass.name}</h1>
        <div class="student-list-container">
          <div class="students-in-school paper-form">
            <h3>Students in the school</h3>
            <form action="/classes/1/students" accept-charset="UFT-8" method="get">
              <input name="utf8" type="hidden" value="✓">
              <input type="text" name="query" id="query" placeholder="Filter by name or class">
              <input type="submit" name="commit" value="Filter" class="little-button" id="filter-students" data-disable-with="Filter">
            </form>
            <br>

            <div id="students-in-school" class="listed-students">
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Grade</th>
                    <th>HR</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="students-in-class paper-form">
            <h3>Students in this class</h3>
            <div id="students-in-klass" class="listed-students">
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Grade</th>
                    <th>HR</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `
    return html
  }
}
