class GradeSerializer < ActiveModel::Serializer
  attributes :id, :score, :student_id, :assignment_id
  belongs_to :student
end
