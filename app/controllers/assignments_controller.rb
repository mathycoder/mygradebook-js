class AssignmentsController < ApplicationController

  def new
    @klass = Klass.find(params[:klass_id])
    @assignment = Assignment.new
    @assignment.grades.build()
  end

  def create
    @klass = Klass.find(params[:klass_id])
    @assignment = Assignment.new(assignment_params)
    if @assignment.save
      redirect_to(klass_path(@klass))
    else
      render 'new'
    end
  end

  def edit
    @klass = Klass.find(params[:klass_id])
    @assignment = Assignment.find(params[:id])
  end

  private

    def assignment_params
      params.require(:assignment).permit(:name, :learning_target_id, :grades_attributes => {})
    end

end
