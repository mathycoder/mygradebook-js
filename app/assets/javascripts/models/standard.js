const standards = []
class Standard {
  constructor(attributes){
    this.id = attributes.id
    this.description = attributes.description
    this.standard_notation = attributes.standard_notation
    this.alt_standard_notation = attributes.alt_standard_notation
    this.grade = attributes.grade
    standards.push(this)
  }

  standardNotationClean(){
    if (this.alt_standard_notation) {
      return this.alt_standard_notation
    } else {
      return this.standard_notation.split("CCSS.Math.Content.")[1]
    }
  }

  static grades(){
    const allGradesArray = standards.map(standard => standard.grade)
    return Array.from(new Set(allGradesArray))
  }

  static byGrade(grade){
    return standards.filter(standard => standard.grade === grade && standard.standard_notation.startsWith('CCSS.Math.Content')).reverse()
  }
}
