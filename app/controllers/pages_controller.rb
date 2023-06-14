class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    @email = "admin@gmail.com"
    user = User.find_by(email: @email)
    @trips = user.trips
  end
end
