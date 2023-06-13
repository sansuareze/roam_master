Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"

  resources :trips do
    resources :stays, only: [:index, :create]
  end
  resources :activities, only: [:index, :show]
  resources :budgets
  resources :reviews
  get '/hotel_search', to: 'stays#hotel_search', as: 'hotel_search'
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"
