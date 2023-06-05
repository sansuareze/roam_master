class BudgetsController < ApplicationController
  def new
    @budget = Budget.new
  end

  def create
    @budget = Budget.new(budget_params)
    if @budget.save
      flash[:success] = "Budget created"
      redirect_to @budget
    else
      render 'new'
    end
  end

  def edit
    @budget = Budget.find(params[:id])
  end

  def update
    @budget = Budget.find(params[:id])
    if @budget.update_attributes(budget_params)
      flash[:success] = "Budget updated"
      redirect_to @budget
    else
      render 'edit'
    end
  end

  def destroy
    Budget.find(params[:id]).destroy
    flash[:success] = "Budget deleted"
    redirect_to budgets_url
  end

  private

    def budget_params
      params.require(:budget).permit(:user_id, :amount, :trip_id)
    end
end
