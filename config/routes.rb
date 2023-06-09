Rails.application.routes.draw do
  get 'pictures/random_image'
  devise_for :users
  root to: "pages#home"

  resources :trips do
    resources :stays, only: [:index, :create]
    resources :activities, only: [:index, :show, :create]
  end
  resources :budgets
  resources :reviews
  resources :stays, only: [:destroy]
  resources :activities, only: [:destroy]
  get '/hotel_search', to: 'stays#hotel_search', as: 'hotel_search'
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"
