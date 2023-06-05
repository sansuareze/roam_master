class StaysController < ApplicationController
  def index
    @stays = Stay.all
    # render view to display @stays
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
    params.require(:stay).permit(:name, :type, :cost, :address, :trip_id)
  end
end
