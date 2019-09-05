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

const students = []
class Student {
  constructor(attributes){
    this.id = attributes.id
    this.first_name = attributes.first_name
    this.last_name = attributes.last_name
    this.grade = attributes.grade
    this.klass = attributes.klass
    students.push(this)
  }

  trHTML(){
    return `<td><button class="little-button">edit</button></td>
            <td>${this.last_name}</td>
            <td>${this.first_name}</td>
            <td>${this.grade}</td>
            <td>${this.klass}</td>`
  }
}
