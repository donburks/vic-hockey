class CreateTable < ActiveRecord::Migration
	def change
		create_table :players do |t|
			t.string :name
			t.integer :number
			t.string :position
			t.string :height
			t.integer :weight
			t.date :dob
			t.string :birthplace
			t.timestamps
		end
	end
end
