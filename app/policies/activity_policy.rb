class ActivityPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    true
  end

  def new?
    create?
  end

  def destroy?
    true
  end
end
