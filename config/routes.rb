Rails.application.routes.draw do

  # get 'web_board/board'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  resources :drawing

  

#        Prefix Verb   URI Pattern                 Controller#Action
# drawing_index GET    /drawing(.:format)          drawing#index
#               POST   /drawing(.:format)          drawing#create
#   new_drawing GET    /drawing/new(.:format)      drawing#new
#  edit_drawing GET    /drawing/:id/edit(.:format) drawing#edit
#       drawing GET    /drawing/:id(.:format)      drawing#show
#               PATCH  /drawing/:id(.:format)      drawing#update
#               PUT    /drawing/:id(.:format)      drawing#update
#               DELETE /drawing/:id(.:format)      drawing#destroy
#          root GET    /                           drawing#index
  
  root 'drawing#index'

  get 'error' => 'drawing#error'


  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'


  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
