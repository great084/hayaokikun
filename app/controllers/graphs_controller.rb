class GraphsController < ApplicationController
  def index
    # サンプルデータ
    gon.chart_label = ['1/1', '1/2', '1/4', '1/5', '1/6', '1/7']
    gon.chart_data  = [60.3, 61.1, 60.8, nil, 60.5, 61.4]

    # dbの情報をjavascriptに渡す
    gon.weight_records = Graph.chart_data(current_user)
    # 記録済みのデータ
    gon.recorded_dates = current_user.graphs.map(&:date)
  end

  def create
    @graph = current_user.graphs.build(graph_params)
    date = @graph.date.strftime('%Y/%-m/%-d')
    if @graph.save
      flash[:notice] = "#{date}の記録を追加しました"
    else
      flash[:alert]  = '登録に失敗しました'
    end
    redirect_to root_path
  end

  def update
    @graph = current_user.graphs.find_by(date: params[:graph][:date])
    date = @graph.date.strftime('%Y/%-m/%-d')
    if @graph.nil?
      flash[:alert] = 'エラーが発生しました'
    elsif params[:_destroy].nil? && @graph.update(graph_params)
      flash[:notice] = "#{date}の記録を修正しました"
    elsif params[:_destroy].present? && @graph.destroy
      flash[:notice] = "#{date}の記録を削除しました"
    else
      flash[:alert] = 'エラーが発生しました'
    end
    redirect_to root_path
  end


  private

  def graph_params
    params.require(:graph).permit(:date, :weight)
  end
  
end
