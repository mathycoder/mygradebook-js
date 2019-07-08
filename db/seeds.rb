

angie = Student.create(first_name: "Angelyse", last_name: "Rosado", grade: 6, klass: 602)
helen = Student.create(first_name: "Helen", last_name: "Cordero", grade: 6, klass: 602)
shaniya = Student.create(first_name: "Shaniya", last_name: "Percell", grade: 6, klass: 602)
davidd = Student.create(first_name: "David", last_name: "Dalum", grade: 6, klass: 602)
melvyn = Student.create(first_name: "Melvyn", last_name: "Parra", grade: 6, klass: 602)
jeymi = Student.create(first_name: "Jeymi", last_name: "Estevez", grade: 6, klass: 602)
davidr = Student.create(first_name: "David", last_name: "Reyes", grade: 6, klass: 602)
ezequiel = Student.create(first_name: "Ezequiel", last_name: "Pujols", grade: 6, klass: 602)
chairys = Student.create(first_name: "Chairys", last_name: "Martinez", grade: 6, klass: 602)
lamani = Student.create(first_name: "Lamani", last_name: "Junious", grade: 6, klass: 602)
amara = Student.create(first_name: "Amara", last_name: "Tourey", grade: 6, klass: 602)
john = Student.create(first_name: "John", last_name: "Jones", grade: 6, klass: 602)

Student.create(first_name: "Elizabeth", last_name: "Mata", grade: 7, klass: 703)
Student.create(first_name: "Angie", last_name: "Pena", grade: 7, klass: 703)
Student.create(first_name: "Richard", last_name: "Fernandez", grade: 7, klass: 703)
Student.create(first_name: "Jeffrey", last_name: "Gutierrez", grade: 7, klass: 703)
Student.create(first_name: "Shaneal", last_name: "Dacres", grade: 7, klass: 703)
Student.create(first_name: "Erica", last_name: "Surita", grade: 7, klass: 703)
Student.create(first_name: "Yarieliz", last_name: "Rivera", grade: 7, klass: 703)
Student.create(first_name: "Jaycob", last_name: "Cutler", grade: 7, klass: 703)
Student.create(first_name: "Johanni", last_name: "Garcia-Santana", grade: 7, klass: 703)
Student.create(first_name: "Richie", last_name: "Rodriguez", grade: 7, klass: 703)

mrsarli = Teacher.create(name: "Mr. Sarli", email: "adam@gmail.com")
klass = mrsarli.klasses.create(name: "602", subject: "math", grade: "6th", period: 3)

lt = LearningTarget.create(name: "1.1 Adding and Subtracting Integers")
klass.learning_targets << lt
assignment = lt.assignments.create(name: "CW Integer Elevator")
angie_grade = angie.grades.create(score: 4)
angie_grade.assignment = assignment
angie_grade.save
