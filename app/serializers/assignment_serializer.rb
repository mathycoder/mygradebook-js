class AssignmentSerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :learning_target_id
  belongs_to :learning_target
  has_many :students
  has_many :grades
end
