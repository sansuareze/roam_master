class StaysController < ApplicationController
  protect_from_forgery with: :exception

  def index
    @trip = Trip.find(params[:trip_id])
    @stays = policy_scope(Stay)
    # render view to display
  end

  def create
    @trip = Trip.find(params[:trip_id])
    @stay = Stay.new(stay_params)
    @stay.trip = @trip
    @stay.cost = params[:price].to_i * @trip.number_of_days.to_i
    @stay.address = params[:location] # Assign the location parameter to the stay
    @stay.image = params[:image]
    @trip.cost = @trip.cost + @stay.cost
    @trip.save
    authorize @stay
    if @stay.save
      render json: { stay: @stay }
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
    @trip = @stay.trip
    @trip.cost = @trip.cost - @stay.cost
    @trip.save
    authorize @stay
    if @stay.destroy
      redirect_to trip_path(@trip)
    else
      render json: { error: "Failed to destroy activity" }, status: :unprocessable_entity
    end

  end

  private

  def stay_params
    params.require(:stay).permit(:name, :type, :cost, :address, :trip_id, :photo, :image)
  end
end
