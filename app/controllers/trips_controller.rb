class TripsController < ApplicationController
  def index
    @trips = Trip.all
  end

  def show
    @trip = Trip.find(params[:id])
  end

  def new
    @trip = Trip.new

  end

  def create
    @trip = Trip.new(trip_params)
    @trip.save
    # No need for app/views/restaurants/create.html.erb
    redirect_to trip_path(@trip)
  end

  def edit
    @trip = Trip.find(params[:id])
  end


  def update
    @trip = Trip.find(params[:id])
    @trip.update(trip_params)
  end

  def destroy
    @trip = Trip.find(params[:id])
    @trip.destroy
    redirect_to restaurants_path, status: :see_other
  end

  private

  def trip_params
    params.require(:trip).permit(:cost, :start_date, :end_date, :location, :name)
  end

end
