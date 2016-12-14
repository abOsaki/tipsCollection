/*
 * 管理者画面
 * ページ読み込み後の処理
 */
function loadEvent(e) {
//console.log('report.js loadEvent() e:' + e);

    // 当月1日
    var fDate = new Date();
    fDate.setDate(1);

    // 当月末日
    var eDate = new Date();
    eDate.setDate(1);
    eDate.setMonth(eDate.getMonth() + 1);
    eDate.setDate(eDate.getDate() - 1);

    // 現在の年月をページにセットする。
    document.getElementById("dispYear").textContent = fDate.getFullYear();
    document.getElementById("dispMonth").textContent = fDate.getMonth() + 1;

    var dateSpan = {
            "fDate": fDate.getFullYear() + "-" + dateZellFill(fDate.getMonth() + 1) + "-01",
            "eDate": eDate.getFullYear() + "-" + dateZellFill(eDate.getMonth() + 1) + "-" + dateZellFill(eDate.getDate())
    };

    // ボタン、年月の初期表示設定
    if (document.getElementById("frmSubmitButton")) {
        document.getElementById("frmSubmitButton").style.display = "inline";
    }
    document.getElementById("prevMonthButton").style.display = "inline";
    document.getElementById("nextMonthButton").style.display = "inline";
    document.getElementById("dispYear").style.display = "inline";
    document.getElementById("dispMonth").style.display = "inline";

    getWorkShiftList(dateSpan, 0);      // 管理者用シフト入力情報一覧を取得する。
    reportSpanChange(0);

}
window.addEventListener("load", loadEvent, false);