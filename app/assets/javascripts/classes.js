const grades = []
class Grade {
  constructor(attributes){
    this.assignment_id = attributes.assignment_id
    this.id = attributes.id
    this.score = attributes.score
    this.student_id = attributes.student_id
    grades.push(this)
  }
}
