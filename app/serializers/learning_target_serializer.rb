class LearningTargetSerializer < ActiveModel::Serializer
  attributes :id, :name, :standard_id
  has_many :students
  has_many :grades
end
