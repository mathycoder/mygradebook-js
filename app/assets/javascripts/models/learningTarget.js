const learningTargets = []
let currLt
class LearningTarget {
  constructor(attributes){
    this.id = attributes.id
    this.name = attributes.name
    this.standard_id = attributes.standard_id
    this.level1 = attributes.level1
    this.level2 = attributes.level2
    this.level3 = attributes.level3
    this.level4 = attributes.level4
    learningTargets.push(this)
  }

  static find(ltId){
    return learningTargets.find(lt => lt.id === Number.parseInt(ltId))
  }

  standard(){
    return standards.find(standard => standard.id === this.standard_id)
  }

  assignments(){
    return assignments.filter(assignment => assignment.learning_target_id === this.id)
  }


  chronologicalAssignments(){
    return this.assignments().sort((a,b) => new Date(a.date) - new Date(b.date))
  }

  studentsChronologicalGrades(student){
    return this.chronologicalAssignments().map(assignment => assignment.grade(student))
  }

  studentAverage(student){
    let grades = this.studentsChronologicalGrades(student)
    grades = grades.map(grade => parseFloat(grade.score))
    grades = grades.filter(grade => !!grade)
    if (grades.length === 0) { return 0 }
    const sum = grades.reduce((acc, grade) => acc + grade)
    const ave = sum / grades.length
    return ave.toFixed(2)
  }

  colorClass(){
    // const ltIndex = learningTargets.indexOf(this)
    const ltIndex = learningTargets.indexOf(learningTargets.find(lt => lt.id === this.id))
    if (ltIndex % 3 === 0) {return "red"}
    else if (ltIndex % 3 === 1) {return "green"}
    else {return "blue"}
  }

  static colorClass(){
    // const ltIndex = learningTargets.indexOf(this)
    const ltIndex = learningTargets.length
    if (ltIndex % 3 === 0) {return "red"}
    else if (ltIndex % 3 === 1) {return "green"}
    else {return "blue"}
  }

  formatShow(){
    let html = ''
    html += `
      <h1>
        ${this.name}
        <div style="display: inline">
          <a href="/classes/${klass.id}/lts/${currLt.id}/edit">edit</a>
        </div>
      </h1>

      <div class="lt-show-container">
        <div class="lt-stats">
          <div class="lt-graph">
            <div id="chart-${this.id}" style="height: 300px; width: 400px;"></div>
          </div>


          <div class="averages">
            <div class="rubric-title ${this.colorClass()}"><strong>${klass.name} LT Stats</strong></div>
            <div>LT Average: </div>
            <div><strong>${this.classAverage()}</strong></div>
            <div>Level 3s and up: </div>
            <div><strong>${this.percentOfStudentsOnLevel(3.0)}</strong></div>
            <div>Level 2s: </div>
            <div><strong>${this.percentOfStudentsOnLevel(2.0)}</strong></div>
            <div>Level 1s: </div>
            <div><strong>${this.percentOfStudentsOnLevel(1.0)}</strong></div>
          </div>

          <div>
          </div>
        </div>

        <div class="lt-show-gradebook">
        </div>

        <div class="lt-show-rub-st-container">
          <div class="lt-show-rubric">
            <div class="rubric-title ${this.colorClass()}">
              <h2>${this.name}</h2>
            </div>
            ${this.rubricLevels()}
          </div>
          <div class="lt-show-standard">
            <h3>${this.standard().standardNotationClean()}</h3>
            <p>${this.standard().description}</p>
          </div>
        </div>

      `
    return html
  }

  rubricLevels(){
    let html = ''
    const levels = [this.level4, this.level3, this.level2, this.level1]
    levels.forEach((level, index) => {
      html += `
        <div class="rubric-score">
          <h2>${4 - index}</h2>
        </div>

        <div class="rubric-score-desc">
          <p>${level}</p>
        </div>
      `
    })
    return html
  }

  percentOfStudentsOnLevel(level){
    const levelUp = (level === 3.0? 1.1 : 1.0)
    let averages = students.map(student => Number.parseFloat(student.average(this)))
    averages = averages.filter(average => !!average)
    const highAverages = averages.filter(average => average >= level && average < (level+ levelUp))
    const percentage = ((highAverages.length / averages.length)*100).toFixed(1)
    return `${percentage}%`
  }

  classAverage(){
    let averages = this.assignments().map(assignment => Number.parseFloat(assignment.average()))
    averages = averages.filter(average => !!average)
    if (averages.length === 0){
      return undefined
    } else {
      const sum = averages.reduce((agg, el) => agg + el)
      const ave = sum / averages.length
      return ave.toFixed(2)
    }
  }

  lineChart(st = undefined){
     new Chartkick.LineChart(`chart-${this.id}`, this.graphData(st), {xtitle: "Date",
                             ytitle: "Avg Score", messages: {empty: "No data"},
                             colors: [this.colorClass(), this.colorClass()], min: 0, max: 4,
                             library: { scales: { yAxes: [{ gridLines: { display: true },ticks: { maxTicksLimit: 5 } }]}}
                           })
  }

  graphData(st){
    const data = this.chronologicalAssignments().map(assignment => {
      let score
      if (st) {
        const studentScore = assignment.grades().find(grade => grade.student_id === st.id)
        if (studentScore) { score = studentScore.score }
      } else {
        score = assignment.average()
      }
      return [assignment.dateDisplay() , score]
    })
    data.length === 0 ? [[0,0]] : data
    return data
  }

  static renderForm(){
    let html = ''
    html += `
    <form class="new_learning_target" id="new_learning_target" action="/classes/1/lts" accept-charset="UTF-8" method="post">
      <h1>Add a new Learning Target</h1>
      <div class="lt-form-container-full">
        <div class="lt-form-container">
          <div id="paper-lt" class="lt-form-standard paper-form">
            <h2>Select a Common Core Standard</h2>

            <select class="select-css grade-band">
              <option value>Select a Grade</option>
            </select>
            <br>

            <input name="utf8" type="hidden" value="✓">
            <div class="error-messages">
              <ul></ul>
            </div>
            <div class="standards-table">
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>Standard</th>
                    <th>Description</th>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <div class="lt-form-rubric">
            <div class="rubric-title ${this.colorClass()}">
              <h2>
                <input size="40" maxlength="50" placeholder="Enter a student-friendly name for this LT" type="text" name="learning_target[name]" id="learning_target_name">
              </h2>
            </div>

            <div class="rubric-score">
              <h2>4</h2>
            </div>

            <div class="rubric-score-desc">
              <p>
                <textarea maxlength="160" placeholder="Optional: What does level 4 understanding look like?" name="learning_target[level4]" id="learning_target_level4"></textarea>
              </p>
            </div>

            <div class="rubric-score">
              <h2>3</h2>
            </div>

            <div class="rubric-score-desc">
              <p>
                <textarea maxlength="160" placeholder="Optional: What does level 3 understanding look like?" name="learning_target[level3]" id="learning_target_level3"></textarea>
              </p>
            </div>

            <div class="rubric-score">
              <h2>2</h2>
            </div>

            <div class="rubric-score-desc">
            <p>
              <textarea maxlength="160" placeholder="Optional: What does level 2 understanding look like?" name="learning_target[level2]" id="learning_target_level2"></textarea>
            </p>
            </div>

            <div class="rubric-score">
              <h2>1</h2>
            </div>

            <div class="rubric-score-desc">
              <p>
                <textarea maxlength="160" placeholder="Optional: What does level 1 understanding look like?" name="learning_target[level1]" id="learning_target_level1"></textarea>
              </p>
            </div>
          </div>
        </div>

        <div class="lt-form-submit-area">
          <div class="lt-form-klasses">
            <p>Add LT to another class:</p>
            <p>
              ${this.otherKlasses()}
            </p>
          </div>

          <div class="lt-form-submit">
            <div class="big-button">
              <input type="submit" name="commit" value="Create Learning target" data-disable-with="Create Learning target">
            </div>
          </div>
        </div>
      </div>
    </form>
    `
    return html
  }

  static otherKlasses(){
    let html = '<input type="hidden" name="learning_target[klasses_attributes][0][id][]">'
    const collection = klasses.filter(kl => kl.id !== klass.id)
    collection.forEach((klass, index) => {

      html += `
      <input type="checkbox" value="${klass.id}" name="learning_target[klasses_attributes][0][id][]" id="learning_target_klasses_attributes_0_id_${klass.id}">
      <label for="learning_target_klasses_attributes_0_id_${index}">${klass.name}</label>
      `
    })



    return html
  }

}
