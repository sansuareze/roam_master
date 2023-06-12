class Trip < ApplicationRecord
  belongs_to :user
  has_one_attached :photo
  has_many :stays
  has_many :activities
end
