# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.0'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'


# Use jquery as the JavaScript library
gem 'jquery-rails'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

#for responding to a post call with id
#build a json response
gem 'responders', '~> 2.0'

#hooray postgres
gem 'pg',             '0.17.1'

# Web Server
gem 'puma'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring', '>=1.3.3'

  #live reloading, need to call 'bundle exec guard' to execute Guardfile
  gem 'guard-livereload', require: false
  #live reloading without browser extension :)
  gem "rack-livereload"

  
end

group :production do
  #idk if this is necessary
  #doubt it
  gem 'rails_12factor', '0.0.2'
end
