class LearningTargetSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :students
  has_many :grades
end
