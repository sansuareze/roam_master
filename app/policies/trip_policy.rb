class TripPolicy < ApplicationPolicy
  def create?
    true
  end

  def new?
    create?
  end

  def show?
    true
  end

  def update?
    @user = user
  end

  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
     def resolve
      scope.all
    end
  end
end
