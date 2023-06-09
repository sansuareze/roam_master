class CreateReviews < ActiveRecord::Migration[7.0]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.string :content
      t.float :rating
      t.references :activity, null: false, foreign_key: true

      t.timestamps
    end
  end
end
