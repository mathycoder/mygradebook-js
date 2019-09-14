Rails App with JavaScript Frontend Spec
Project Specs:
* Must have a Rails Backend and new requirements implemented through JavaScript.

  - This app uses endpoints at klasses#index, klasses#show, and students#new as the Rails Backend, and adds all the new JS requirements.

* Makes use of ES6 features as much as possible(e.g Arrow functions, Let & Const, Constructor Functions)

  - Arrow functions are used in most cases for callback functions.  For example, my Student Class has a #find static method:

    static find(studentId){
      return students.find(student => studentId === student.id)
    }

  - Let and Const are always used instead of var.  

  - My app has 7 JS Models, which are created using ES6 Classes.  An example:

  class Grade {
    constructor(attributes){
      this.assignment_id = attributes.assignment_id
      this.id = attributes.id
      this.score = attributes.score
      this.student_id = attributes.student_id
      grades.push(this)
    }

* Must translate the JSON responses into Javascript Model Objects using either ES6 class or constructor syntax.

  - After receiving JSON responses, my ajax calls will create JS Model Objects using ES6 class syntax.  Example:  

  function getIndexData(){
    $('main')[0].innerHTML = ''
    $.get(`/classes.json`, function(json){
      for (i = 0; i<json.length; i++){
        klasses.push(new Klass(json[i]))
      }
      new Teacher(json[0].teachers[0])
      renderIndexPage()
    })
  }

* Must render at least one index page (index resource - 'list of things') via JavaScript and an Active Model Serialization JSON Backend.

  - My app renders two index pages via JS and AMS.  The klasses/index page and the students/new page, which functions as the student index page.

* Must render at least one show page (show resource - 'one specific thing') via JavaScript and an Active Model Serialization JSON Backend.

  - My app renders the klasses/show page using JS and AMS.  

* Your Rails application must reveal at least one `has-many` relationship through JSON that is then rendered to the page.

  - My app uses many has-many relationships through JSON to render the klasses/index and klasses/show pages.  Here's my Klass Serializer:

  class KlassSerializer < ActiveModel::Serializer
    attributes :id, :name, :subject, :grade, :period
     has_many :students
     has_many :learning_targets
     has_many :standards
     has_many :teachers
     has_many :assignments
     has_many :grades
  end

* Must use your Rails application to render a form for creating a resource that is submitted dynamically through JavaScript.

  - On the klasses/show page, it is possible to dynamically send PATCH requests to modify existing grades in the database.  

  - On the students/new page, it is possible to dynamically send POST, PATCH, and DELETE requests to create, edit, and delete students in the databse.  

* At least one of the JS Model Objects must have a method on the prototype.

  - I use many methods on the prototype of my JS Model Objects.  Since they're defined using ES6 Classes, each method is on the prototype (thanks to the 'syntactic sugar' of ES6 Classes).  For example, the methods .grades() and .grade(student) are both on the Assignment prototype.  


  class Assignment {
    constructor(attributes){
      ...
    }

    static renderAverages(){
      ...
    }

    grades(){
      return grades.filter(grade => grade.assignment_id === this.id)
    }

    grade(student){
      return this.grades().find(grade => grade.student_id === student.id)
    }


Project Repo Specs:
Read Me file contains:
* Application Description
* Installation guide (e.g. fork and clone repo, migrate db, bundle install, etc)
* Contributors guide (e.g. file an issue, file an issue with a pull request, etc)
* Licensing statement at the bottom (e.g. This project has been licensed under the MIT open source license.)
Repo General
* You have a large number of small Git commits
* Your commit messages are meaningful
* You made the changes in a commit that relate to the commit message
* You don't include changes in a commit that aren't related to the commit message
