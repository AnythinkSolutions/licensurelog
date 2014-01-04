class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name
      t.string :description, :null => true, :limit => 4080
      t.integer :user_id
      t.integer :certification_id
      t.integer :required_hours, :null => true
      t.integer :parent_id, :null => true

      t.timestamps
    end
  end
end
