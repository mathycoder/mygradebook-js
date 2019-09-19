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
  $('.add-student-button').click(addStudentToKlass)
}

function createStudentsInKlass(json, cla){
  for (i = 0; i<json.length; i++){
    let student = new cla(json[i])
    $('#students-in-klass tbody').append(student.fullTrInKlassHTML())
  }
  $('.remove-student-button').click(removeStudentFromKlass)
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

function addStudentToKlass(){
  const element = this
  $(this).parent().parent().remove()
  changeKlassStatus(element)
}

function removeStudentFromKlass(){
  const element = this
  $(this).parent().parent().remove()
  changeKlassStatus(element)
}

function changeKlassStatus(element){
  const klassId = window.location.href.split("/")[4]
  const studentId = element.id.split("-")[1]
   $.ajax({
   type: 'PATCH',
   url: `/classes/${klassId}/students/${studentId}`
 }).done((data, status, xhr) => {
   if (xhr.status === 201){
     console.log("added student!")
     const student = new Student(data)
     $('#students-in-klass tr:first-child').after(student.fullTrInKlassHTML())
     $(`#student-${student.id} .remove-student-button`).click(removeStudentFromKlass)
   } else if (xhr.status === 200){
     console.log("removed student!")
     const student = new Student(data)
     $('#students-in-school tr:first-child').after(student.fullTrInSchoolHTML())
     $(`#student-${student.id} .add-student-button`).click(addStudentToKlass)
   }
 })
}
