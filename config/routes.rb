Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  resources :activities, only: [:index, :show]
  resources :trips
  resources :activities
  resources :budgets
  resources :reviews
  resources :stays
  get '/hotel_search', to: 'stays#hotel_search', as: 'hotel_search'
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"
