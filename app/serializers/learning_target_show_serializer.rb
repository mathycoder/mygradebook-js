class LearningTargetShowSerializer < ActiveModel::Serializer
  attributes :id, :name, :level1, :level2, :level3, :level4, :standard_id
  belongs_to :standard
  has_many :students
  has_many :klasses
  has_many :assignments
  has_many :grades
  has_many :students
  has_many :teachers
end
