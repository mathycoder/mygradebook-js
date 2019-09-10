const standards = []
class Standard {
  constructor(attributes){
    this.id = attributes.id
    this.alt_standard_notation = attributes.alt_standard_notation
    standards.push(this)
  }
}

let klass
class Klass {
  constructor(attributes){
    this.id = attributes.id
    this.name = attributes.name
    this.subject = attributes.subject
    this.grade = attributes.grade
    this.period = attributes.period
    klass = this
  }
}

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
    const ltIndex = learningTargets.indexOf(this)
    if (ltIndex % 3 === 0) {return "red"}
    else if (ltIndex % 3 === 1) {return "green"}
    else {return "blue"}
  }
}

const assignments = []
class Assignment {
  constructor(attributes){
    this.id = attributes.id
    this.name = attributes.name
    this.date = attributes.date
    this.learning_target_id = attributes.learning_target_id
    assignments.push(this)
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

const grades = []
class Grade {
  constructor(attributes){
    this.assignment_id = attributes.assignment_id
    this.id = attributes.id
    this.score = attributes.score
    this.student_id = attributes.student_id
    grades.push(this)
  }

  student(){
    return students.find(student => student.id === this.student_id)
  }

  static find(gradeId){
    return grades.find(grade => grade.id === Number.parseInt(gradeId))
  }

  update(data){
    this.score = data.score
    $(`#${this.id}.score`).children()[0][2].value = this.score
  }


  colorChange(color){
    $(`#${this.id}.score`).addClass(`color-change-${color}`)
  }

  colorChangeBack(){
    $(`#${this.id}.score`).removeClass('color-change-blue')
    $(`#${this.id}.score`).removeClass('color-change-red')
    $(`#${this.id}.score`).addClass('change-back')
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

  static byLastName(){
    return students.sort((a,b) => a.last_name.localeCompare(b.last_name))
  }

  fullName(){
    return `${this.last_name}, ${this.first_name}`
  }

  average(){
    const myGrades = grades.filter(grade => grade.student_id === this.id && grade.score)
    const sum = myGrades.reduce((acc, grade) => acc + Number.parseFloat(grade.score), 0)
    if (sum === 0) {return undefined}
    return (sum / myGrades.length).toFixed(2)
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
}
