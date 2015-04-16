class CreateDrawings < ActiveRecord::Migration
  def change
    create_table :drawings do |t|
      t.text :imgUrl

      t.timestamps null: false
    end
  end
end
