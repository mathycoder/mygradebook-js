$(document).ready(function(){
  if ($('.gradebook').length > 0){
    conditionalFormatting()
  }
})

function conditionalFormatting() {
  const allTds = $('.assignment-averages')
  for (let i=0; i<=allTds.length; i++) {
    if (allTds[i] !== undefined) {
      const num = parseFloat(allTds[i].querySelector('strong').innerHTML)
      let color
      if (num >= 3.0) {
        color = "rgb(196, 221, 185)"
      } else if (num >= 2.0) {
        color = "rgb(221, 220, 185)"
      } else {
        color = "rgb(221, 186, 185)"
      }
      allTds[i].style.backgroundColor = color
    }
  }
}

function rowSorter(direction, type) {
  const tbody = document.querySelector('tbody')
  const allTrs = document.querySelectorAll('tr')
  document.querySelector('tbody').innerHTML = ''

  for(let i=0; i<3; i++) {
    document.querySelector('tbody').appendChild(allTrs[i])
  }

  let arrayOfSortObjects = []

  for(let i=3; i<allTrs.length; i++) {
    const obj = {index: i,
                 average: parseFloat(allTrs[i].querySelector('td.average').innerText),
                 name: allTrs[i].querySelector('td.student-name').innerText
               }
    arrayOfSortObjects.push(obj)
  }

  arrayOfSortObjects.sort(function(a,b) {
    if (direction === "highest" && type === "average") {
      return b.average - a.average
    } else if (direction === "lowest" && type === "average"){
      return a.average - b.average
    } else if (direction === "highest" && type === "name") {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

  for(let i=0; i<arrayOfSortObjects.length; i++) {
    document.querySelector('tbody').appendChild(allTrs[arrayOfSortObjects[i].index])
  }
}
