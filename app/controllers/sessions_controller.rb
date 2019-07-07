class SessionsController < ApplicationController
  def new
    @teacher = Teacher.new
  end

  def create
    @teacher = Teacher.find_by(email: params[:teacher][:email])
    if @teacher
      session[:user_id] = @teacher.id
      redirect_to(klasses_path)
    else
      redirect_to(login_path)
    end
  end

  def destroy
    session.clear
    redirect_to(login_path)
  end

  private

    # def teacher_params
    #   params.require(:teacher).permit(:email)
    # end
end
