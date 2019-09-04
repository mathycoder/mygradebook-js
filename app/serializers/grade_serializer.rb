class GradeSerializer < ActiveModel::Serializer
  attributes :id, :score, :student_id, :assignment_id
end
