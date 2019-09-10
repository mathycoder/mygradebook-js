const standards = []
class Standard {
  constructor(attributes){
    this.id = attributes.id
    this.standard_notation = attributes.standard_notation
    this.alt_standard_notation = attributes.alt_standard_notation
    standards.push(this)
  }

  standardNotationClean(){
    if (this.alt_standard_notation) {
      return this.alt_standard_notation
    } else {
      return this.standard_notation.split("CCSS.Math.Content.")[1]
    }
  }
}
