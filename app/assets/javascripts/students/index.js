$().ready(() => {
  if (/http:\/\/localhost:3000\/classes\/\d\/students/.test(window.location.href)){
    getClassStudentsIndexData()
  }
})


function getClassStudentsIndexData() {
  const klassId = window.location.href.split("/")[4]
  $.get(`/classes/${klassId}/students.json`, function(json){
    createStudentJSONObjects(json, Student)
  })
}

function createStudentJSONObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
  //displayIndexStudents()
}

function displayIndexStudents(){
  Student.displayStudentsInDOM()
  $('.delete-student-button').click(deleteStudent)
  $('.edit-student-button').click(editStudent)
}
