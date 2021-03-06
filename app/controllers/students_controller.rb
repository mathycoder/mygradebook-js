class StudentsController < ApplicationController
  before_action :find_klass_nested_route, only: [:redirect, :index, :show]
  before_action :find_student, only: [:show, :edit, :destroy]
  before_action :student_in_klass?, only: [:show]
  before_action :require_lts, only: [:index]

  require 'csv'

  def new
    @students = Student.filter_by(params[:query], nil)
    respond_to do |format|
      format.html
      format.json {render json: @students}
    end
  end

  def csv
  end

  def csv_upload
    CSV.foreach(params[:students].path, headers: true) do |student|
      Student.create(last_name: student[0], first_name: student[1], grade: student[2], klass: student[3])
    end
    redirect_to(new_student_url, alert: "CSV successfully uploaded")
  end

  def create
    @student = Student.new(student_params)
    if @student.save
      render json: @student, status: 201
    else
      render json: @student, status: 422
    end
  end

  def redirect
    @student = Student.find_by(id: params[:student][:id])
    @student ? redirect_to(klass_student_path(@klass, @student)) : redirect_to(klass_students_path(@klass))
  end

  def index
    @students = Student.filter_by(params[:query], @klass)
    @mystudents = @klass.students_by_last_name
    respond_to do |format|
      format.html
      format.json {render json: {inschool: @students,
                                 inklass: @mystudents}}
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json {render json: @student}
    end
  end

  def edit
    @students = Student.filter_by(params[:query], @klass)
  end

  def update
    if params[:klass_id]
      find_klass_nested_route
      find_student
      if @klass.students.include?(@student)
        @klass.students.delete(@student)
        render json: @student, status: 200
      else
        add_student_to_klass
        render json: @student, status: 201
      end
    else
      @student = Student.find_by(id: params[:id])
      if @student.update(student_params)
        render json: @student, status: 201
      else
        render json: @student, status: 422
      end
    end
  end

  def destroy
    @student.destroy
    render json: @student, status: 201
  end

  private

    def student_params
      params.require(:student).permit(:first_name, :last_name, :grade, :klass)
    end

    def find_student
      @student = Student.find_by(id: params[:id])
      redirect_to(klasses_url, alert: "You don't have access to that student") if @student.nil?
    end

    def student_in_klass?
      redirect_to(klass_students_url(@klass), alert: "You don't have access to that student") if !@klass.students.include?(@student)
    end

    def add_student_to_klass
      @klass.students << @student
      @klass.assignments.each do |assignment|
        assignment.grades.find_or_create_by(student_id: @student.id)
      end
    end

end
