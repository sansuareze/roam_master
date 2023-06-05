class CreateActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :activities do |t|
      t.string :name
      t.float :cost
      t.date :date
      t.string :description
      t.string :type
      t.references :trip, null: false, foreign_key: true

      t.timestamps
    end
  end
end
