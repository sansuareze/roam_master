class ReviewsController < ApplicationController
  def create
    @activity = Activity.find(params[:activity_id])
    @review = @activity.reviews.new(review_params)
    if @review.save
      redirect_to @activity, notice: 'Review was successfully created.'
    else
      render :new
    end
  end

  # Updates an existing review for a specific activity
  def update
    @activity = Activity.find(params[:activity_id])
    @review = @activity.reviews.find(params[:id])
    if @review.update(review_params)
      redirect_to @activity, notice: 'Review was successfully updated.'
    else
      render :edit
    end
  end

  # Deletes an existing review for a specific activity
  def destroy
    @activity = Activity.find(params[:activity_id])
    @review = @activity.reviews.find(params[:id])
    @review.destroy
    redirect_to @activity, notice: 'Review was successfully destroyed.'
  end

  private

  # Only allow a trusted parameter "white list" through.
  def review_params
    params.require(:review).permit(:content, :rating)
  end
end
