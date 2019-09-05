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
    table.appendChild(tr)
  }
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
   const newStudent = new Student(data)
   const tr = document.createElement('tr')
   tr.innerHTML = students[i].trHTML()
   table.appendChild(tr)
 })
}
