$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes\/new$/.test(window.location.href)){
    getIndexData(forHeader = false, forIndexHeader = true)
    renderNewKlassForm()
  }
})

function renderNewKlassForm(){
  $('main').append(Klass.formatKlassForm())
  $('.submit-klass').click(submitClass)
  history.pushState(null, null, `http://localhost:3000/classes/new`)
}

function submitClass(e){
  e.preventDefault()
  const values = $(this).parent().parent().serialize()
  $.post($(this).parent().parent()[0].action, values)
    .done(data => {
      clearData()
      getIndexData()
      renderFlash("New Class created")
   }).fail(data => {
      renderErrorMessages(data.responseJSON)
    })
}
