class CreateGraphs < ActiveRecord::Migration[5.2]
  def change
    create_table :graphs do |t|
      t.date :date
      t.float :weight
      t.time :wakeup_time
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    # 同一ユーザが同一日のデータを複数記録できないようにする。
    add_index :graphs, [:user_id, :date], unique: true
  end
end
