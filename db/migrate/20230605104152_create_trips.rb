class CreateTrips < ActiveRecord::Migration[7.0]
  def change
    create_table :trips do |t|
      t.string :name
      t.string :location
      t.float :budget
      t.datetime :start_date
      t.datetime :end_date
      t.references :user, null: false, foreign_key: true
      t.float :cost, default: 0
      t.integer :number_of_days

      t.timestamps
    end
  end
end
