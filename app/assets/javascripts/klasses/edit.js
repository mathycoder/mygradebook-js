$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes\/\d+\/edit$/.test(window.location.href) || /^https:\/\/my-gradebook.herokuapp.com\/classes\/\d+\/edit$/.test(window.location.href)){
    getIndexData(forHeader = false, forIndexHeader = true)
    getKlassDataBeforeEdit()
  }
})


function getKlassDataBeforeEdit(klassIdFromLink = undefined){
  const klassId = klassIdFromLink || window.location.href.split("/")[4]
  $.get(`/classes/${klassId}.json`, function(json){
    klass = new Klass(json)
    new Teacher(json.teachers[0])
    renderKlassEditForm()
  })
}

function renderKlassEditForm(){
  $('main').append(Klass.formatKlassForm())
  $('.submit-klass').click(updateKlass)
  $('.delete-klass').click(deleteKlass)
  if (/^http:\/\/localhost:3000$/.test(window.location.href)) {
    history.pushState(null, null, `http://localhost:3000/classes/${klass.id}/edit`)
  } else {
    history.pushState(null, null, `https://my-gradebook.herokuapp.com/classes/${klass.id}/edit`)
  }
}

function updateKlass(e){
  e.preventDefault()
  console.log("Updating class...")
  const values = $(this).parent().parent().serialize()
  $.ajax({
  type: 'PATCH',
  url: `/classes/${klass.id}`,
  data: values
  }).done(data => {
    clearData()
    getIndexData()
    renderFlash("Class updated")
 }).fail(data => {
    renderErrorMessages(data.responseJSON)
  })

}

function deleteKlass(e){
  e.preventDefault()
  console.log("Deleting class...")
  $.ajax({
  type: 'DELETE',
  url: `/classes/${klass.id}`
  }).done(data => {
    clearData()
    getIndexData()
    renderFlash("Class deleted")
  })
}
