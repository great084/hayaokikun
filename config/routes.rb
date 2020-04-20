Rails.application.routes.draw do
  devise_for :users
  # get 'graphs/index'
  root 'graphs#index'
  resource :graphs, only: %i[index create update]
end
