class StandardSerializer < ActiveModel::Serializer
  attributes :id, :alt_standard_notation, :standard_notation
  belongs_to :student
end
