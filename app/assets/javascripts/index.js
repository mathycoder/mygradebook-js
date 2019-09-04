$(document).on('turbolinks:load', function() {
  const array = window.location.href.split('/')
  // Checks for the correct show page before running getData()
  if (array.length === 5 && array[3] === 'classes' && array[4] !== 'new'){
    getData()
  }
})

// Something weird is happening with the scope.  'grades' gets pushed
// in createJSONObjects.  But we can't access 'grades' outside of the
// scope.  Hopefully this has something to do with document.ready,
// because 'grades' is available in the JS console in the browser.
function getData() {
  const klassId = window.location.href.split("/")[4]
  $.get('/classes/' + klassId + '/grades', function(json){
    createJSONObjects(json, Grade)
  })
}

function createJSONObjects(json, cla){
  for (i = 0; i<json.length; i++){
    new cla(json[i])
  }
  displayCurrentGrades()
}

function displayCurrentGrades() {
  const gradeTds = $('.score')
  for (let i=0; i<gradeTds.length; i++){
    const grade = grades.find(grade => grade.id === Number.parseInt(gradeTds[i].id))
    gradeTds[i].innerText = grade.score
    gradeTds[i].click(clickEvent)
  }
}

function clickEvent() {
  alert("ouch!")
}
