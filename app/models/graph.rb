class Graph < ApplicationRecord
  belongs_to :user
  validates :date, presence: true, uniqueness: { scope: :user_id}
  validates :weight, presence: true
  # validates :wakeup_time, presence: true

  # 指定したユーザのデータをDBから取り出し配列を作成するメソッド
  def self.chart_data(user)
    data = []
    graphs = user.graphs.order(date: :asc)
    # 記録がない場合にエラーが出るのを防止
    return [{date: Date.today, weight: nil}] if graphs.empty?

    # リファクタリング前
    # graphs.each do |graph|
    #   data << {
    #     date: graph.date,
    #     weight: graph.weight
    #   }
    # end
    # data

    # リファクタリング後(データが存在しない日もweightをnilとしてデータ登録)
    period = graphs[0].date..graphs[-1].date
    index = 0
    period.map do |date|
      if graphs[index].date == date
        weight = graphs[index].weight
        index += 1
      end
      { date: date, weight: weight }
    end
  end
end
