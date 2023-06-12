class ActivitiesController < ApplicationController
  def index
    @activities = Activity.all
  end

  def show
    @activity = Activity.find(params[:id])
    @reviews = @activity.reviews
  end


  private

  def activity_params
    params.require(:activity).permit(:name, :cost, :date, :description, :type, :trip_id, :photo)
  end
end
