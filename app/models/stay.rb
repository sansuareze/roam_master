class Stay < ApplicationRecord
  belongs_to :trip
  def price
    self.cost
  end
end
