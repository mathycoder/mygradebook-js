class StudentSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :grade, :klass
end
