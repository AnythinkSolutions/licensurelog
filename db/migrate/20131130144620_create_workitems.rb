class CreateWorkitems < ActiveRecord::Migration
  def change
    create_table :workitems do |t|
      t.date :date
      t.integer :user_id
      t.integer :category_id
      t.integer :certification_id
      t.float :hours
      t.text :notes, :null => true, :limit => 4080
      t.boolean :signed_off, :default => false

      t.timestamps
    end
  end
end
