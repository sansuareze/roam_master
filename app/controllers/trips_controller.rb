class TripsController < ApplicationController
  def index
    @trips = Trip.all
  end

  def show
    @trip = Trip.find(params[:id])
    authorize @trip
  end

  def new
    @trip = Trip.new
    authorize @trip
  end

  def create
    @trip = Trip.new(trip_params)
    @trip.user = current_user
    @trip.save
    authorize @trip
    redirect_to trip_path(@trip)
  end

  def edit
    @trip = Trip.find(params[:id])
  end


  def update
    @trip = Trip.find(params[:id])
    @trip.update(trip_params)
    authorize @trip
  end

  def destroy
    @trip = Trip.find(params[:id])
    @trip.destroy
    redirect_to restaurants_path, status: :see_other
  end

  private

  def trip_params
    params.require(:trip).permit(:start_date, :end_date, :location, :name, :budget, :photo)
  end

end
