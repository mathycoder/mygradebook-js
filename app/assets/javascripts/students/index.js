$().ready(() => {
  if (/http:\/\/localhost:3000\/classes\/\d\/students/.test(window.location.href)){
    $('.listed-students tr:first-child').nextAll().remove()
    getClassStudentsIndexData()
    $('#filter-students').click(filterIndexStudents)
  }
})


function getClassStudentsIndexData() {
  const klassId = window.location.href.split("/")[4]
  $.get(`/classes/${klassId}/students.json`, function(json){
    createStudentsInSchool(json.inschool, Student)
    createStudentsInKlass(json.inklass, Student)
  })
}

function createStudentsInSchool(json, cla){
  for (i = 0; i<json.length; i++){
    let student = new cla(json[i])
    $('#students-in-school tbody').append(student.fullTrInSchoolHTML())
  }
}

function createStudentsInKlass(json, cla){
  for (i = 0; i<json.length; i++){
    let student = new cla(json[i])
    $('#students-in-klass tbody').append(student.fullTrInKlassHTML())
  }
}

function filterIndexStudents(e){
  e.preventDefault()
  const values = $(this.parentElement).serialize()
  const klassId = window.location.href.split("/")[4]
  $.ajax({
  type: 'GET',
  url: `/classes/${klassId}/students.json`,
  data: values
}).done(json => {
    students.length = 0
    $('#students-in-school tr:first-child').nextAll().remove()
    createStudentsInSchool(json.inschool, Student)
  })
}

// function displayIndexStudents(){
//   Student.displayStudentsInDOM()
//   $('.delete-student-button').click(deleteStudent)
//   $('.edit-student-button').click(editStudent)
// }
