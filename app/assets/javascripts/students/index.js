$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes\/\d+\/students$/.test(window.location.href) || /^http:\/\/localhost:3000\/classes\/\d+\/students\?utf8\=%E2%9C%93&commit\=%2BS$/.test(window.location.href)){

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
  $('.add-student-button').click(changeKlassStatus)
}

function createStudentsInKlass(json, cla){
  for (i = 0; i<json.length; i++){
    let student = new cla(json[i])
    $('#students-in-klass tbody').append(student.fullTrInKlassHTML())
  }
  $('.remove-student-button').click(changeKlassStatus)
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

function changeKlassStatus(){
  $(this).parent().parent().remove()
  const klassId = window.location.href.split("/")[4]
  const studentId = this.id.split("-")[1]
   $.ajax({
   type: 'PATCH',
   url: `/classes/${klassId}/students/${studentId}`
 }).done((data, status, xhr) => {
   const student = new Student(data)
   if (xhr.status === 201){
     $('#students-in-klass tr:first-child').after(student.fullTrInKlassHTML())
     $(`#student-${student.id} .remove-student-button`).click(changeKlassStatus)
   } else if (xhr.status === 200){
     $('#students-in-school tr:first-child').after(student.fullTrInSchoolHTML())
     $(`#student-${student.id} .add-student-button`).click(changeKlassStatus)
   }
 })
}
