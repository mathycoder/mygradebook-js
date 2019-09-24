const assignments = []
let currAssignment
class Assignment {
  constructor(attributes){
    this.id = attributes.id
    this.name = attributes.name
    this.date = attributes.date
    this.learning_target_id = attributes.learning_target_id
    assignments.push(this)
  }

  static renderAverages(){
    const averageTds = $('.assign-average')
    for (let i=0; i<averageTds.length; i++){
      const assignment = Assignment.find(Number.parseInt(averageTds[i].id.split("-")[1]))
      let average = assignment.average()
      average = average || ""
      averageTds[i].innerHTML = `<strong>${average}</strong>`
    }
  }

  learningTarget(){
    return learningTargets.find(lt => lt.id === this.learning_target_id)
  }

  grades(){
    return grades.filter(grade => grade.assignment_id === this.id)
  }

  grade(student){
    return this.grades().find(grade => grade.student_id === student.id)
  }

  jsDate(){
    const date = new Date(this.date)
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${date.getFullYear()}-${month}-${day}`
  }

  dateDisplay(){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(this.date)
    return `${months[date.getMonth()]} ${date.getDate()}`

  }

  average(){
    const assignmentGrades = grades.filter(grade => grade.assignment_id === this.id && grade.score && Student.inKlass(grade.student()))
    const sum = assignmentGrades.reduce((acc, grade) => acc + Number.parseFloat(grade.score), 0)
    if (sum === 0) {return undefined}
    return (sum / assignmentGrades.length).toFixed(2)
  }

  static find(assignmentId){
    return assignments.find(assignment => assignment.id === Number.parseInt(assignmentId))
  }

  static formatAssignmentForm(){
    let html = ''
    html += `
      <div class="paper-form assignment">
        <form action="/classes/${klass.id}/assignments" method="post" accept-charset="UTF-8">
          <input name="utf8" type="hidden" value="✓">
          <h1>${currAssignment ? 'Edit' : 'Add new'} assignment for ${klass.name}</h1>

          <div class="error-messages">
            <ul></ul>
          </div>

          <div>
            <label for="assignment_name">Name of assignment</label>
            <br>
            <input class="text-field" maxlength="40" value="${currAssignment ? currAssignment.name : ''}" required="required" size="40" type="text" name="assignment[name]" id="assignment_name">
            <br><br>
          </div>

          <div>
            <label for="assignment_date">Date of Assignment</label>
            <br>
            <input value="${currAssignment ? currAssignment.jsDate() : ''}" required="required" type="date" name="assignment[date]"" id="assignment_date">
            <br><br>
          </div>

          <div>
            <select class="select-css" required="required" name="assignment[learning_target_id]" id="assignment_learning_target_id">
              <option value>Select the Learning Target</option>
              ${this.assignmentLearningTargetOptions()}
            </select>
            <br><br>
          </div>

          <div class="assignment-form-table">
            <table>
              <tbody>
                ${this.assignmentFormStudents()}
              </tbody>
            </table>
          </div>

          <div class="big-button">
            <br>
            <input class = "submit-assignment" type="submit" name="commit" value="${currAssignment ? 'Update' : 'Create'} Assignment" data-disable-with="Create Assignment">
          </div>
        </form>
        ${currAssignment ? `<br><button class="big-button delete-assignment">Delete</button>` : ''}
      </div>
    `
    return html
  }

  static assignmentFormStudents() {
    let html = ''

    students.forEach((student, index) => {
      let grade
      if (currAssignment) {grade = currAssignment.grade(student) }
      html += `
        <tr>
          <td>
            <label for="assignment_grades_attributes_${index}_score">${student.fullName()}</label>
          </td>

          <td>
            <label for="assignment_grades_attributes_${index}_score">
              <input class="text-field-grade" value="${currAssignment && grade.score ? grade.score : ''}" maxlength="3" size="3" type="text" name="assignment[grades_attributes][${index}][score]" id="assignment_grades_attributes_${index}_score">
            </label>
          </td>

          <input value="${student.id}" type="hidden" name="assignment[grades_attributes][${index}][student_id]" id="assignment_grades_attributes_${index}_student_id"
        </tr>
      `
    })

    return html
  }

  static assignmentLearningTargetOptions() {
    let html = ''
    learningTargets.forEach(lt => {
      html += `<option ${currAssignment && lt.id === currAssignment.learning_target_id ? 'selected="selected"' : ''}value="${lt.id}">${lt.name}</option>`
    })
    return html
  }

}
