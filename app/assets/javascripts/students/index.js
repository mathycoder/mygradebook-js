$().ready(() => {
  if (/http:\/\/localhost:3000\/classes\/\d\/students/.test(window.location.href)){
    $('.listed-students tr:first-child').nextAll().remove()
    getClassStudentsIndexData()
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

// function displayIndexStudents(){
//   Student.displayStudentsInDOM()
//   $('.delete-student-button').click(deleteStudent)
//   $('.edit-student-button').click(editStudent)
// }
