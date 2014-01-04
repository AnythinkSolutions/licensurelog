class AddCapToCategory < ActiveRecord::Migration
  def change
    add_column :categories, :cap, :integer, :null => true
  end
end
