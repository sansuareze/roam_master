class AddImageToStays < ActiveRecord::Migration[7.0]
  def change
    add_column :stays, :image, :string
  end
end
