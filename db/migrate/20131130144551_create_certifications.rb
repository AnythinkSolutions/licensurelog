class CreateCertifications < ActiveRecord::Migration
  def change
    create_table :certifications do |t|
      t.string :name
      t.string :description, :null => true, :limit => 4080
      t.integer :user_id
      t.date :begin_date
      t.date :goal_date, :null => true
      t.date :expire_date, :null => true
      t.string :notes, :null => true

      t.timestamps
    end
  end
end
