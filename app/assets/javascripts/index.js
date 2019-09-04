$(document).on('turbolinks:load', function() {
  const array = window.location.href.split('/')
  // Checks for the correct show page before running getData()
  if (array.length === 5 && array[3] === 'classes' && array[4] !== 'new'){
    getData()
  }
})


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
}
