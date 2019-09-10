const learningTargets = []
class LearningTarget {
  constructor(attributes){
    this.id = attributes.id
    this.name = attributes.name
    this.standard_id = attributes.standard_id
    learningTargets.push(this)
  }

  standard(){
    return standards.find(standard => standard.id === this.standard_id)
  }

  assignments(){
    return assignments.filter(assignment => assignment.learning_target_id === this.id)
  }


  chronologicalAssignments(){
    return this.assignments().sort((a,b) => new Date(a.date) - new Date(b.date))
  }

  studentsChronologicalGrades(student){
    return this.chronologicalAssignments().map(assignment => assignment.grade(student))
  }

  colorClass(){
    const ltIndex = learningTargets.indexOf(this)
    if (ltIndex % 3 === 0) {return "red"}
    else if (ltIndex % 3 === 1) {return "green"}
    else {return "blue"}
  }
}
