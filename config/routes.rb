Rails.application.routes.draw do
  resources :students
  resources :klasses, :path => 'classes'
  resources :teachers
  get '/signup', to: "teachers#new"
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'

  resources :klasses, :path => 'classes' do
    get '/add_students', to: "klasses#add_students"
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
