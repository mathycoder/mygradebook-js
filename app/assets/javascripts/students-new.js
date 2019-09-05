$(document).on('turbolinks:load', function() {
  if (window.location.href === "http://localhost:3000/students/new"){
    getStudentsIndexData()
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
    tr.innerHTML = `<td><button class="little-button">edit</button></td>
                    <td>${students[i].last_name}</td>
                    <td>${students[i].first_name}</td>
                    <td>${students[i].grade}</td>
                    <td>${students[i].klass}</td>`
    table.appendChild(tr)
  }
}
