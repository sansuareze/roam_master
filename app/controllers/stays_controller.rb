class StaysController < ApplicationController
  protect_from_forgery with: :exception

  def index
    @trip = Trip.find(params[:trip_id])
    @stays = policy_scope(Stay)
    # render view to display @stays
  end

  def create
    @trip = Trip.find(params[:trip_id])
    @stay = Stay.new(stay_params)
    @stay.trip = @trip
    authorize @stay
    if @stay.save
      redirect_to trip_path(@trip), notice: "Hotel added to your trip"
    end
  end

  def show
    @stay = Stay.find(params[:id])
    # render view to display @stay
  end

  def add_to_trip
    @stay = Stay.find(params[:id])
    @trip = Trip.find(params[:trip_id])
    @trip.stays << @stay
    redirect_to trip_path(@trip)
  end

  def update
    @stay = Stay.find(params[:id])
    if @stay.update(stay_params)
      redirect_to stay_path(@stay)
    else
      render :edit
    end
  end

  def destroy
    @stay = Stay.find(params[:id])
    @stay.destroy
    redirect_to stays_path
  end

  private

  def stay_params
    params.permit(:name)
  end
end
