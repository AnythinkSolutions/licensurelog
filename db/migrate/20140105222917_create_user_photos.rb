class CreateUserPhotos < ActiveRecord::Migration
  def change
    create_table :user_photos do |t|

      t.integer :user_id, :null => false
      t.string :description
      t.string :content_type, :null => false
      t.string :filename, :null => false
      t.column :image, :binary, :null => false

      t.timestamps
    end
  end
end
