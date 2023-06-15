class ActivitiesController < ApplicationController
  protect_from_forgery with: :exception

  def index
    @activities = policy_scope(Activity)
    @activities = Activity.all
    @activity = Activity.new
    @trip = Trip.find(params[:trip_id])
    authorize @activities
  end

  def create
    @trip = Trip.find(params[:trip_id])
    @activity = Activity.new(activity_params)
    @activity.trip = @trip
    @activity.name = params[:name]
    @activity.description = params[:description]
    @activity.cost = params[:cost].to_i
    @activity.image = params[:image]
    @trip.cost = @trip.cost + @activity.cost
    @trip.save
    authorize @activity
    if @activity.save
      render json: @activity
    else
      render json: { error: "failed to add activity to trip"}, status: :unprocessable_entity
    end
  end

  def show
    @activity = Activity.find(params[:id])
    # render view to display @activity
  end

  def update
    @activity = Activity.find(params[:id])
    if @activity.update(activity_params)
      redirect_to activity_path(@activity)
    else
      render :edit
    end
  end

  def destroy
    @activity = Activity.find(params[:id])
    @trip = @activity.trip
    @trip.cost = @trip.cost - @activity.cost
    @trip.save
    authorize @activity
    if @activity.destroy
      redirect_to trip_path(@trip)
    else
      render json: { error: "Failed to destroy activity" }, status: :unprocessable_entity
    end
  end


  private

  def activity_params
    params.permit(:name, :cost, :description, :trip_id, :image)
  end
end
