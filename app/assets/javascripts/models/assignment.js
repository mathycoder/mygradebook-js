const assignments = []
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
}
