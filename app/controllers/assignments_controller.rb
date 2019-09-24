class AssignmentsController < ApplicationController
  before_action :find_klass_nested_route
  before_action :find_assignment, only: [:edit, :update, :destroy]
  before_action :require_lts

  def new
    @assignment = Assignment.new
    @assignment.grades.build
    respond_to do |format|
      format.html
      format.json {render json: @klass}
    end
  end

  def create
    @assignment = Assignment.new(assignment_params)

    if @assignment.save
      render json: @assignment, status: 201
    else
      render json: @assignment.errors.full_messages, status: 422
    end

    #@assignment.save ? (redirect_to(klass_path(@klass), alert: "Assignment successfully added")) : (render 'new')
  end

  def edit
    respond_to do |format|
      format.html
      format.json {render json: @assignment, serializer: AssignmentSerializer}
    end
  end

  def update
    #@assignment.update(assignment_params) ? (redirect_to(klass_path(@klass), alert: "Assignment successfully updated")) : (render 'edit')
    if @assignment.update(assignment_params)
      render json: @assignment, status: 201
    else
      render json: @assignment.errors.full_messages, status: 422
    end

  end

  def destroy
    @assignment.grades.destroy_all
    @assignment.destroy
    render json: @assignment, status: 201
    #redirect_to(klass_path(@klass), alert: "Assignment deleted")
  end

  private

    def find_assignment
      @assignment = Assignment.find_by(id: params[:id])
      redirect_to(klass_path(@klass), alert: "You don't have access to that assignment") if @assignment.nil? || !@klass.assignments.include?(@assignment)
    end

    def assignment_params
      params.require(:assignment).permit(:name, :learning_target_id, :date, :grades_attributes => {})
    end

    def require_lts
      unless !@klass.learning_targets.empty?
        flash[:error] = "Before you can add assignments, you need to add your first learning target"
        redirect_to(klass_learning_targets_url(@klass))
      end
    end

end
