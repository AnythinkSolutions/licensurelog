class AddIsgroupToCategory < ActiveRecord::Migration
  def change
    add_column :categories, :is_group, :boolean, :null => false, :default => false
  end
end
