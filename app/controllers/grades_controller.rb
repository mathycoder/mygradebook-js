class GradesController < ApplicationController
  def index
    @klass = Klass.find(params[:klass_id])
    render json: @klass.grades, status: 200
  end

  def update
    binding.pry
  end
end
