// import Chartkick from "chartkick"
// import Chart from "chart.js"
//
// Chartkick.use(Chart)

const learningTargets = []
class LearningTarget {
  constructor(attributes){
    this.id = attributes.id
    this.name = attributes.name
    this.standard_id = attributes.standard_id
    learningTargets.push(this)
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

      `
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

// <h1>
//   <%= @lt.name %>
  // <div style="display: inline">
  //   <%= link_to("edit", edit_klass_learning_target_path(@klass, @lt), data: { turbolinks: false } ) %>
  // </div>
// </h1>
//
//
//
// <div class="lt-show-container">
//   <div class="lt-stats">
//     <div class="lt-graph">
//        <%= line_chart(lt.graph_data(@klass), width: "400px", xtitle: "Date",
//                  ytitle: "Avg Score", messages: {empty: "No data"},
//                  colors: [@klass.my_color_class(lt), @klass.my_color_class(lt)], min: 0, max: 4,
//                  library: { scales: { yAxes: [{ gridLines: { display: true },ticks: { maxTicksLimit: 5 } }]}}) %>
//
//     </div>
//
//     <div class="averages">
//       <div class="rubric-title <%= @klass.my_color_class(lt) %>"><strong><%= @klass.name %> LT Stats</strong></div>
//       <div>LT Average: </div>
//       <div><strong><%= lt.class_average(klass) %></strong></div>
//       <div>Level 3s and up: </div>
//       <div><strong><%= lt.percent_of_students_on_level(@klass, 3.0)%></strong></div>
//       <div>Level 2s: </div>
//       <div><strong><%= lt.percent_of_students_on_level(@klass, 2.0)%></strong></div>
//       <div>Level 1s: </div>
//       <div><strong><%= lt.percent_of_students_on_level(@klass, 1.0)%></strong></div>
//     </div>
//
//     <div>
//     </div>
//   </div>
//
//
  // <div class="lt-show-gradebook">
  //   <%= render partial: "klasses/table", locals: {klass: @klass, lt: @lt, collection: [@lt], klass_or_lt: @lt} %>
  // </div>
//
//   <div class="lt-show-rub-st-container">
//     <div class="lt-show-rubric">
//       <%= render partial: "learning_targets/rubric", locals: {klass: @klass, lt: @lt} %>
//     </div>
//
//     <% if @lt.standard %>
//       <div class="lt-show-standard">
//         <h3><%= @lt.standard.standard_notation_clean %></h3>
//         <p><%= @lt.standard.description %></p>
//       </div>
//     <% end %>
//   </div>
// </div>
