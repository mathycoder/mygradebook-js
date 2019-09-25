$(document).ready(function() {
  if (window.location.href === "http://localhost:3000/students/new"){
    getIndexData(forHeader = false, forIndexHeader = true)
    getStudentsIndexData()
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
  $('main')[0].innerHTML = ''
  $('main').append(Student.renderIndexPage())
  displayStudents()
}

function displayStudents(){
  Student.displayStudentsInDOM()
  $('.delete-student-button').click(deleteStudent)
  $('.edit-student-button').click(editStudent)
  $('.big-button').click(addStudent)
  $('.filter-button').click(filterStudents)
  $('.sort-by-name').click(sortByName)
}

function filterStudents(){
  event.preventDefault()
  console.log("filtering!")
  const values = $(this.parentElement).serialize()
  $.ajax({
  type: 'GET',
  url: `/students/new.json`,
  data: values
  }).done(data => {
    students.length = 0
    $('#student-list-header').nextAll().remove()
    createJSONObjectsStudents(data, Student)
  })
}

function addStudent(event){
  event.preventDefault()
  const values = $(this.parentElement.parentElement).serialize()
  if (!stId){
    $.post('/students', JSON.stringify(values))
      .done(data => {
         const student = new Student(data)
         student.addTrToDOM()
         student.addClickEvents()
         Student.resetFormFields()
     })
   } else {
     $.ajax({
     type: 'PATCH',
     url: `/students/${stId}`,
     data: JSON.stringify(values)
   }).done(data => {
     const student = Student.find(data.id)
     student.update(data)
     student.updateTrOnDOM()
     student.addClickEvents()
     Student.resetFormFields()
     unhighlightAllTrs()
     $('#add-student-header').text('Add Student')
     stId = undefined
   })
  }
}

function editStudent(event){
  $('#add-student-header').text('Edit Student')
  const studentId = Number.parseInt(this.id.split('-')[1])
  const student = Student.find(studentId)
  student.fillForm()
  stId = student.id
  unhighlightAllTrs()
  $(this).parent().parent()[0].style.backgroundColor = "yellow"

}

function deleteStudent(event){
  const studentId = this.id.split('-')[1]
  $.ajax({
   type: 'DELETE',
   url: `/students/${studentId}`
    }).done(function(data) {
      $(`#student-${data.id}`).remove()
      $('#add-student-header').text('Add Student')
      stId = undefined
    })
}

function unhighlightAllTrs(){
  const trs = $('tr')
  for (let i=0; i<trs.length; i++){
    trs[i].style.backgroundColor = "inherit"
  }
}

function sortByName(){
  $.ajax({
  type: 'GET',
  url: `/students/new.json`
  }).done(data => {
    data.sort(function(a, b) {
      var nameA = a.first_name.toUpperCase();
      var nameB = b.first_name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });

    students.length = 0
    $('#student-list-header').nextAll().remove()
    createJSONObjectsStudents(data, Student)
  })
}
