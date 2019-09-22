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
    `
    return html
  }
}
