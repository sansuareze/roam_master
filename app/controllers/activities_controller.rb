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
    @activity.cost = params[:cost]
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

  def add_to_trip
    @activity = Activity.find(params[:id])
    @trip = Trip.find(params[:trip_id])
    @trip.activities << @activity
    redirect_to trip_path(@trip)
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
    @activity.destroy
    redirect_to activities_path
  end

  private

  def activity_params
    params.permit(:name, :cost, :description, :trip_id)
  end
end
