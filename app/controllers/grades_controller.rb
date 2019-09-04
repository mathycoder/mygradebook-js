class GradesController < ApplicationController
  def index
    @klass = Klass.find(params[:klass_id])
    render json: @klass.grades, status: 200
  end

  def update
    @grade = Grade.find_by(id: params[:id])
    if @grade.update(score: params[:grade][:score])
      render json: @grade, status: 201
    else
      @grade = Grade.find_by(id: params[:id])
      render json: @grade, status: 201
    end
  end
end
