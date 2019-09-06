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
  event.preventDefault()
  const values = $(this.parentElement.parentElement).serialize()
  if (!stId){
    $.post('/students', JSON.stringify(values))
      .done(data => {
         const student = new Student(data)
         $('#student-list-header').after(student.fullTrHTML())
         $(`#student-${student.id} .delete-student-button`).click(deleteStudent)
         $(`#student-${student.id} .edit-student-button`).click(editStudent)
         $('.new-student-form')[0].reset()
     })
   } else {
     $.ajax({
     type: 'PATCH',
     url: `/students/${stId}`,
     data: JSON.stringify(values)
   }).done(data => {
     const student = Student.find(data.id)
     student.update(data)
     $(`#student-${data.id}`)[0].innerHTML = student.trHTML()
     $(`#student-${student.id} .delete-student-button`).click(deleteStudent)
     $(`#student-${student.id} .edit-student-button`).click(editStudent)
     $('.new-student-form')[0].reset()
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
