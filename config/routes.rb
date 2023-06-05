Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  resources :trips do
    resources :activities
    resources :budgets
    resources :reviews
    resources :stays
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"
end
