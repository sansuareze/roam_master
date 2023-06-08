class ActivitiesController < ApplicationController
  def index
    @activities = policy_scope(Activity)
    @activities = Activity.all

    authorize @activities
  end

  def show
    @activity = Activity.find(params[:id])
    @reviews = @activity.reviews
  end


  private

  def activity_params
    params.require(:activity).permit(:name, :cost, :date, :description, :type, :trip_id)
  end
end
