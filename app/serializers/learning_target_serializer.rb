class LearningTargetSerializer < ActiveModel::Serializer
  attributes :id, :name, :standard_id, :level1, :level2, :level3, :level4
  has_many :students
  has_many :grades
end
