$(document).on('turbolinks:load', function() {
  if (window.location.href === "http://localhost:3000/students/new"){
    getStudentsIndexData()
    $('.new-student-form').submit(addStudent)
  }
})


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
  const table = document.querySelector('table')
  for (let i=0; i<students.length; i++){
    let tr = document.createElement('tr')
    tr.innerHTML = students[i].trHTML()
    tr.id = `student-${students[i].id}`
    table.appendChild(tr)
  }
  $('.delete-student-button').click(deleteStudent)
}

function addStudent(event){
  event.preventDefault()
  const values = $(this).serialize()
  $.ajax({
   type: 'POST',
   url: '/students',
   data: JSON.stringify(values)
   }).done(function(data) {
     const table = document.querySelector('table')
     const tableHeader = document.querySelector('#student-list-header')
     const newStudent = new Student(data)
     const tr = document.createElement('tr')
     tr.id = `student-${newStudent.id}`
     tr.innerHTML = students[i].trHTML()
     //referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
     tableHeader.parentNode.insertBefore(tr, tableHeader.nextSibling)
   })
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
