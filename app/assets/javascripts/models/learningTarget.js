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

  formatShow(){
    let html = ''
    html += `
      <h1>
        ${currLt.name}
        <div style="display: inline">
          <a href="/classes/${klass.id}/lts/${currLt.id}/edit">edit</a>
        </div>
      </h1>

      <div class="lt-show-container">
        <div class="lt-stats">
          <div class="lt-graph">
            <div id="chart-1" style="height: 300px; width: 400px;"></div>
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

  lineChart(){
     new Chartkick.LineChart("chart-1", this.graphData(), {xtitle: "Date",
                             ytitle: "Avg Score", messages: {empty: "No data"},
                             colors: [this.colorClass(), this.colorClass()], min: 0, max: 4,
                             library: { scales: { yAxes: [{ gridLines: { display: true },ticks: { maxTicksLimit: 5 } }]}}
                           })
  }

  graphData(){
    const data = this.assignments().map(assignment => {
      const score = assignment.average()
      return [assignment.dateDisplay() , score]
    })
    return data
  }

    // data = self.assignments.map do |assignment|
    //   if student
    //     student_score = assignment.grades.where("student_id = ?", student.id).limit(1).first
    //     score = student_score.score if student_score
    //   else
    //     score = assignment.average(klass)
    //   end
    //   [assignment.date.strftime('%b %d, %Y'), score]
    // end
    // data.empty? ? [[0,0]] : data

}
