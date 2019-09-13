$().ready(() => {
  if (/^http:\/\/localhost:3000\/classes$/.test(window.location.href)){
    getIndexData()
  }
})

function getIndexData(){
  $('main')[0].innerHTML = ''
  $.get(`/classes.json`, function(json){
    for (i = 0; i<json.length; i++){
      klasses.push(new Klass(json[i]))
    }
    let indexHtml = Klass.formatIndex(json[0].teachers[0].name)
    $('main').append(indexHtml)
    $('.class-link').click(clickOnClass)
  })
}

function clickOnClass(e){
  e.preventDefault()
  const klassId = this.dataset.id
  $('main')[0].innerHTML = ''
  renderKlassShowHeader(klassId)
  getData(klassId)
  $('.class-header select').change(switchClass)
}

function renderKlassShowHeader(klassId){
  $('header')[0].innerHTML = ''
  let html = ''

  html += `
    <a href="http://localhost:3000/classes/${klassId}">
      <div class="header-logo">
        <img src="/assets/open-book2.png">
      </div>
    </a>
    <div>
      <form action="http://localhost:3000/classes/${klassId}/assignments/new" method="get">
        <input name="utf8" type="hidden" value="✓">
        <input type="submit" name="commit" value="+A" class="fancy-button" data-disable-with="+A">
      </form>
    </div>
    <div>
      <form action="http://localhost:3000/classes/${klassId}/lts/new" method="get">
        <input name="utf8" type="hidden" value="✓">
        <input type="submit" name="commit" value="+LT" class="fancy-button" data-disable-with="+LT">
      </form>
    </div>
    <div>
      <form action="http://localhost:3000/classes/${klassId}/students" method="get">
        <input name="utf8" type="hidden" value="✓">
        <input type="submit" name="commit" value="+S" class="fancy-button" data-disable-with="+S">
      </form>
    </div>
    <div class="class-header">
    <form class="edit_klass" action="http://localhost:3000/classes/redirect" method="get">
      <select class="select-blend" name="klass[id]" id="klass_id">
        <option value="">Classes</option>`

      klasses.forEach(klass => {
        html += `
          <option ${klass.id === Number.parseInt(klassId) ? 'selected="selected"' : ''}" value="${klass.id}">Class ${klass.name}</option>
        `
      })

      html += `
      </select>
    </form>
  </div>
  <div class="header-select">
    <form class="new_learning_target" id="new_learning_target" action="http://localhost:3000/classes/${klass.id}/learning_targets/redirect" method="get">
      <select class="select-blend select-lts" onchange="this.form.submit();" name="learning_target[name]">
        <option>Learning Targets</option>
      </select>
    </form>
  </div>
  <div class="header-select">
    <form class="new_student" id="new_student" method="get" action="http://localhost:3000/classes/2/students/redirect">
      <input name="utf8" type="hidden" value="✓">
      <select class="select-blend select-students" onchange="this.form.submit();" name="student[name]">
        <option>Students</option>
      </select>
    </form>
  </div>

  <div class="header-logout">
    <a href="/logout">Log Out</a>
  </div>

  <a href="/teachers/1">
    <div class="header-profile">
      <img src="/assets/uploads/Screen Shot 2019-07-22 at 2.27.08 PM-3da2e3a55d0e5b69298347a62b3c77a0e47e3d9b310f0c18c8bc2676d113e720.png">
    </div>
  </a>
  `

  $('header').append(html)
}
