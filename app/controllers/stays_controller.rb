class StaysController < ApplicationController
 
  def index
    @trip = Trip.find(params[:trip_id])
    protect_from_forgery with: :exception
    @stays = policy_scope(Stay)
    # render view to display @stays
  end

  def create
    @trip = Trip.find(params[:trip_id])
    @stay = Stay.new(stay_params)
    @stay.trip = @trip
    @stay.cost = params[:price] # Assign the price parameter to the stay
    @stay.address = params[:location] # Assign the location parameter to the stay
    authorize @stay

    if @stay.save
      render json: @stay
    else
      render json: { error: 'Failed to add stay to trip' }, status: :unprocessable_entity
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
    authorize @stay
    redirect_to trip_path(@stay.trip_id)
  end

  private

  def stay_params
    params.require(:stay).permit(:name, :type, :cost, :address, :trip_id, :photo)
  end
end
