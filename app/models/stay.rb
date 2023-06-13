class Stay < ApplicationRecord
  belongs_to :trip
  def price
    self.cost
  end
  has_one_attached :photo
end
