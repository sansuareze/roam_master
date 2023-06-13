class Trip < ApplicationRecord
  belongs_to :user
  has_one_attached :photo
  has_many :stays
  has_many :activities

  def self.calculate_days(start_date, end_date)
    first_date = start_date.to_datetime.to_date
    last_date = end_date.to_datetime.to_date
    days = (last_date - first_date).to_i
    return days
  end
end
