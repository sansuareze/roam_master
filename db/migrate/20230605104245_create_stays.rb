class CreateStays < ActiveRecord::Migration[7.0]
  def change
    create_table :stays do |t|
      t.string :category
      t.string :name
      t.float :cost
      t.string :address
      t.references :trip, null: false, foreign_key: true

      t.timestamps
    end
  end
end
