// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
document.addEventListener('turbolinks:load', () => {
    // カレンダーサンプル
    const CAL_TODAY = new Date(new Date().setHours(0, 0, 0, 0))
    const CAL_A_MONTH_AGO = new Date(CAL_TODAY.getFullYear(), CAL_TODAY.getMonth() -1, CAL_TODAY.getDate())

    // 選択できない日付データ
    const DISABLE_DATES = ['2019-12-10', '2020-04-05']

    // カレンダーの日本語化
    flatpickr.localize(flatpickr.l10ns.ja)

    // カレンダーの表示
    flatpickr('#date-form', {
        // スマホでもfaltpickarを使用
        disableMobile: true,
        // 1ヶ月前から本日まで選択可能
        minDate: CAL_A_MONTH_AGO,
        maxDate: CAL_TODAY,
        // 選択できない日付
        disable: DISABLE_DATES
    })

    // 新規登録用のカレンダー
    flatpickr('#new-calendar', {
        disableMobile: true,
        // 記録のある日付を選択できないようにする
        disable: gon.recorded_dates,
        defaultDate: CAL_TODAY
    })    

    // 編集モーダルで日付を選択したときに、記録された体重を表示する
    const editCalendar = document.getElementById('edit-calendar')
    const editWeight = document.getElementById('edit-weight')
    const inputWeight = () => {
        let record = gon.weight_records.find((record) => record.date === editCalendar.value)
        editWeight.value = record.weight
    }

    // 変更登録用のカレンダー
    flatpickr('#edit-calendar', {
        disableMobile: true,
        // 記録のある日付を選択できないようにする
        enable: gon.recorded_dates,
        // 記録がない日付を選択できないようにする
        noCalendar: gon.recorded_dates.length === 0,
        onChange: inputWeight
    })    

    // 棒グラフのデータ
    // let barLabel = ['1月','2月','3月','4月','5月']
    // let barData = [5, 4, 2, 6, 5]

    // // 棒グラフのオプション
    // const barChartData = {
    //     labels: barLabel,
    //     datasets: [{
    //         label: '点数',
    //         data:   barData,
    //         backgroundColor: 'rgba(54, 162, 235, 0.2)',
    //         borderColor: 'rgba(54, 162, 235, 1)',
    //         borderWidth: 1
    //     }]
    // } 

    // const barChartOption = {
    //     title: {
    //         display: true,
    //         text: '棒グラフ'
    //     },
    //     scales: {
    //         yAxes: [{
    //             ticks: {
    //                 // yAxesのメモリを0からスタートに強制
    //                 beginAtZero: true
    //             }
    //         }]
    //     }
    // }

    // 棒グラフを表示
    // const barChartContext = document.getElementById("bar-chart").getContext('2d')
    // new Chart(barChartContext, {
    //     type: 'bar',
    //     data: barChartData,
    //     options: barChartOption
    // })

    // 折れ線グラフのデータ
    let lineLabel = gon.chart_label
    let lineData = gon.chart_data

    const lineChartData = {
        labels: lineLabel,
        datasets: [{
            label: '体重(kg)',
            data:   lineData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            spanGaps: true
        }]
 
    }
    const lineChartOption = {
        title: {
            display: true,
            text: '折れ線グラフ'
        },
        tooltips: {
            callbacks: {
                // ホバー時のラベル表示を変更
                title: function (tooltipItems){
                    return tooltipItems[0].xLabel.replace(/^(\d+).(\d+)$/, ' $1 月 $2 日')
                },
                label: function (tooltipItem) {
                    return '体重：' + tooltipItem.yLabel + 'kg'
                }
            }
        }
    }

    // 折れ線グラフを表示
    // const lineChartContext = document.getElementById("line-chart").getContext('2d')
    // new Chart(lineChartContext, {
    //     type: 'line',
    //     data: lineChartData,
    //     options: lineChartOption
    // })
    

    // chart-weightを表示
    // 文字列からjsの日付を取得(時差の影響を考慮し、setHoursを使用)
    const convertDate = (date) => new Date(new Date(date).setHours(0,0,0,0))

    // 日付の古い方・新しい方を取得する関数
    const minDate = (date1, date2) => (date1 < date2) ? date1 : date2
    const maxDate = (date1, date2) => (date1 > date2) ? date1 : date2

    // データの初日・最終日
    const START_DATE = convertDate(gon.weight_records[0].date)
    const END_DATE = convertDate(gon.weight_records[gon.weight_records.length - 1].date)

    // カレンダーの日本語化
    flatpickr.localize(flatpickr.l10ns.ja)


    const drawGraphForPeriod = () => {
        let from = convertDate(document.getElementById('start-calendar').value)
        let to = convertDate(document.getElementById('end-calendar').value)

        if (from > to) {
            alert('終了日は開始日以降の日付を設定してください')
        } else {
            drawGraph(from, to)
        }
    }
    const periodCalendarOption = {
        disableMobile: true,
        // 選択できる期間を設定
        minDate: START_DATE,
        maxDate: END_DATE,
        // 日付選択後のイベント
        onChange: drawGraphForPeriod
    }

    // カレンダー
    const startCalendarFlatpickr = flatpickr('#start-calendar', periodCalendarOption)
    const endCalendarFlatpickr = flatpickr('#end-calendar', periodCalendarOption)

    // 当日＆過去日付を取得
    const TODAY = convertDate(new Date())
    const A_WEEK_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() -6 )
    const TWO_WEEKS_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 13)
    const A_MONTH_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth() -1, TODAY.getDate() + 1)
    const THREE_MONTHS_AGO =new Date(TODAY.getFullYear(), TODAY.getMonth() - 3, TODAY.getDate() + 1)

    // グラフを描く場所を取得
    const chartWeightContext = document.getElementById("chart-weight").getContext('2d')
    let chartWeight

    // 期間を指定してグラフを描く
    const drawGraph = (from, to) => {
        //from toの期間のデータに絞る
        let records = gon.weight_records.filter((record) => {
            let date = convertDate(record.date)
            return from <= date && date <= to
        })

        // 日付のみのデータを作成
        let dates = records.map((record) => {
            // 横軸ラベルは'2020-01-08'を'1/8'のように、日付の簡易形式に変換する
            return record.date.replace(/^\d+-0*(\d+)-0*(\d+)$/, '$1/$2')
        })

        // 体重のみのデータを作成
        let weights = records.map((record) => record.weight)

        let weightData = {
            labels: dates,
            datasets: [{
                label: '体重(kg)',
                data: weights,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                spanGaps: true
            }]
        }

        let weightOption = {
            tooltips: {
                callbacks: {
                    // ホバー時のラベル表示を変更
                    title: function(tooltipItems){
                        return tooltipItems[0].xLabel.replace(/^(\d+).(\d+)$/, ' $1 月 $2 日')
                    },
                    label: function(tooltipItem) {
                        return '体重：　' + tooltipItem.yLabel + 'kg'
                    }
                }
            }
        }

        // new Chart(chartWeightContext, {
        //     type: 'line',
        //     data: weightData,
        //     options: weightOption
        // })

        if (!chartWeight) {
            // グラフが存在しない場合は、作成
            chartWeight = new Chart(chartWeightContext, {
                type: 'line',
                data: weightData,
                options: weightOption
            })
        } else {
            // グラフが存在するときは、更新
            chartWeight.data = weightData
            chartWeight.options = weightOption
            chartWeight.update()
        }
    }

    // 引数の日付から今日までのグラフを描く関数
    const drawGraphToToday = (from) => {
        // データが存在する範囲に修正
        from = maxDate(from, START_DATE)
        let to = minDate(TODAY, END_DATE)
        drawGraph(from, to)
        // フォームの開始日・終了日を変更する
        startCalendarFlatpickr.setDate(from)
        endCalendarFlatpickr.setDate(to)
    }

    // 過去XX週間のグラフを描くボタンが押された場合
    document.getElementById('a-week-button').addEventListener('click', () => {
        drawGraphToToday(A_WEEK_AGO)
    })

    document.getElementById('two-weeks-button').addEventListener('click', () => {
        drawGraphToToday(TWO_WEEKS_AGO)
    })
    
    document.getElementById('a-month-button').addEventListener('click', () => {
        drawGraphToToday(A_MONTH_AGO)
    })
    
    document.getElementById('three-months-button').addEventListener('click', () => {
        drawGraphToToday(THREE_MONTHS_AGO)
    })
    
    // グラフの初期表示
    drawGraphToToday(A_MONTH_AGO)


})