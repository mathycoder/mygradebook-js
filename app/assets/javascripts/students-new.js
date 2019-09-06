$(document).on('turbolinks:load', function() {
  if (window.location.href === "http://localhost:3000/students/new"){
    getStudentsIndexData()
    $('.big-button').click(addStudent)
  }
})

let stId

function getStudentsIndexData() {
  $.get('/students/new.json', function(json){
    createJSONObjectsStudents(json, Student)
  })
}

function createJSONObjectsStudents(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
  displayStudents()
}

function displayStudents(){
  students.forEach(student => $('table').append(student.fullTrHTML()))
  $('.delete-student-button').click(deleteStudent)
  $('.edit-student-button').click(editStudent)
}

function addStudent(event){
  console.log("Add a student!")
  event.preventDefault()
  const values = $(this.parentElement.parentElement).serialize()

  // creates a new student
  if (!stId){
    $.ajax({
     type: 'POST',
     url: '/students',
     data: JSON.stringify(values)
     }).done(function(data) {
       const student = new Student(data)
       $('#student-list-header').after(student.fullTrHTML())
       $(`#student-${newStudent.id} .delete-student-button`).click(deleteStudent)
       $(`#student-${newStudent.id} .edit-student-button`).click(editStudent)
       $('.new-student-form')[0].reset()
     })
   } else { // modifies existing student
     $.ajax({
     type: 'PATCH',
     url: `/students/${stId}`,
     data: JSON.stringify(values)
   }).done(function(data) {
     console.log("updated!")
     const currentStudent = students.find(student => data.id === student.id)
     currentStudent.first_name = data.first_name
     currentStudent.last_name = data.last_name
     currentStudent.grade = data.grade
     currentStudent.klass = data.klass
     $(`#student-${data.id}`)[0].innerHTML = currentStudent.trHTML()
     $('.delete-student-button').click(deleteStudent)
     $('.edit-student-button').click(editStudent)
   })
  }
}

function editStudent(event){
  const studentId = Number.parseInt(this.id.split('-')[1])
  const currStudent = students.find(student => student.id === studentId)
  $('#text-field-first-name')[0].value = currStudent.first_name
  $('#text-field-last-name')[0].value = currStudent.last_name
  $('#text-field-grade')[0].value = currStudent.grade
  $('#text-field-klass')[0].value = currStudent.klass
  stId = currStudent.id
  const trs = $('tr')
  for (let i=0; i<trs.length; i++){
    trs[i].style.backgroundColor = "inherit"
  }
  $(this).parent().parent()[0].style.backgroundColor = "yellow"

}

function deleteStudent(event){
  console.log("you trying to delete me?")
  const studentId = this.id.split('-')[1]
  $.ajax({
   type: 'DELETE',
   url: `/students/${studentId}`
    }).done(function(data) {
      $(`#student-${data.id}`).remove()
    })
}
