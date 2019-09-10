const grades = []
class Grade {
  constructor(attributes){
    this.assignment_id = attributes.assignment_id
    this.id = attributes.id
    this.score = attributes.score
    this.student_id = attributes.student_id
    grades.push(this)
  }

  student(){
    return students.find(student => student.id === this.student_id)
  }

  static find(gradeId){
    return grades.find(grade => grade.id === Number.parseInt(gradeId))
  }

  update(data){
    this.score = data.score
    $(`#${this.id}.score`).children()[0][2].value = this.score
  }


  colorChange(color){
    $(`#${this.id}.score`).addClass(`color-change-${color}`)
  }

  colorChangeBack(){
    $(`#${this.id}.score`).removeClass('color-change-blue')
    $(`#${this.id}.score`).removeClass('color-change-red')
    $(`#${this.id}.score`).addClass('change-back')
  }
}
