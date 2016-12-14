function setYearOptions(e) {
    var dateFromYear = document.getElementById("yearDateFrom");
    var dateFromMonth = document.getElementById("monthDateFrom");
    //var dateFromDay = document.getElementById("dayDateFrom");
    var dateToYear = document.getElementById("yearDateTo");
    var dateToMonth = document.getElementById("monthDateTo");
    //var dateToDay = document.getElementById("dayDateTo");

    /*
    for (var year = 2010; year < 2030; year++) {
        var option;
        option = document.createElement("option");
        option.textContent = year;
        dateFromYear.appendChild(option);

        option = document.createElement("option");
        option.textContent = year;
        dateToYear.appendChild(option);
    }
    */

    dateFromYear.addEventListener("change", function (e) {
        setSelectedDateTo();
        //setMonthOptions(e, dateFromYear, dateFromMonth, dateFromDay);
        //setDayOptions(e, dateFromYear, dateFromMonth, dateFromDay);
    }, false);
    dateFromMonth.addEventListener("change", function (e) {
        setSelectedDateTo();
        //setDayOptions(e, dateFromYear, dateFromMonth, dateFromDay);
    }, false);

    dateToYear.addEventListener("change", function (e) {
        setSelectedDateFrom();
        //setMonthOptions(e, dateToYear, dateToMonth, dateToDay);
        //setDayOptions(e, dateToYear, dateToMonth, dateToDay);
    }, false);
    dateToMonth.addEventListener("change", function (e) {
        setSelectedDateFrom();
        //setDayOptions(e, dateToYear, dateToMonth, dateToDay);
    }, false);
}

function setSelectedDateFrom() {
    var dateFromYear = document.getElementById("yearDateFrom");
    var dateFromMonth = document.getElementById("monthDateFrom");
    var dateToYear = document.getElementById("yearDateTo");
    var dateToMonth = document.getElementById("monthDateTo");
    var fYear = parseInt(dateFromYear.value);
    var fMonth = parseInt(dateFromMonth.value);
    var eYear = parseInt(dateToYear.value);
    var eMonth = parseInt(dateToMonth.value);

    if (fYear > eYear || (fYear == eYear && fMonth > eMonth)) {
        dateFromYear.selectedIndex = dateToYear.selectedIndex;
        dateFromMonth.selectedIndex = dateToMonth.selectedIndex;
    }
}

function setSelectedDateTo() {
    var dateFromYear = document.getElementById("yearDateFrom");
    var dateFromMonth = document.getElementById("monthDateFrom");
    var dateToYear = document.getElementById("yearDateTo");
    var dateToMonth = document.getElementById("monthDateTo");
    var fYear = parseInt(dateFromYear.value);
    var fMonth = parseInt(dateFromMonth.value);
    var eYear = parseInt(dateToYear.value);
    var eMonth = parseInt(dateToMonth.value);

    if (fYear > eYear || (fYear == eYear && fMonth > eMonth)) {
        dateToYear.selectedIndex = dateFromYear.selectedIndex;
        dateToMonth.selectedIndex = dateFromMonth.selectedIndex;
    }
}

function filter(order) {
console.log('filter(' + order + ') start');
    var dateFromYear = document.getElementById("yearDateFrom").value;
    var dateFromMonth = document.getElementById("monthDateFrom").value;
    //var dateFromDay = document.getElementById("dayDateFrom").value;
    var dateToYear = document.getElementById("yearDateTo").value;
    var dateToMonth = document.getElementById("monthDateTo").value;
    //var dateToDay = document.getElementById("dayDateTo").value;
    //var name = document.getElementById("userNameSelect").value;

    var fDate = new Date(dateFromYear, dateFromMonth - 1, 1);
    var eDate = new Date(dateToYear, dateToMonth, 1);
    eDate.setDate(eDate.getDate() - 1);

    var data = {
        "fDate": fDate.getFullYear() + "-" + ('0' + (fDate.getMonth() + 1)).slice(-2) + "-01",
        "eDate": eDate.getFullYear() + "-" + ('0' + (eDate.getMonth() + 1)).slice(-2) + "-" + ('0' + eDate.getDate()).slice(-2)
    };
    //console.log(JSON.stringify(data));


    //タブ判定
    if (document.getElementById("workShiftView").classList.contains("active")) {
console.log('workshiftView');

        var dispYear = document.getElementById("dispYear");
        var dispMonth = document.getElementById("dispMonth");
        var fDate = new Date(parseInt(dispYear.textContent), parseInt(dispMonth.textContent) - 1, 1);
        var eDate = new Date(fDate.getFullYear(), fDate.getMonth() + 1, 1);
        eDate.setDate(eDate.getDate() - 1);
        dispYear.textContent = fDate.getFullYear();
        dispMonth.textContent = fDate.getMonth() + 1;
        var data = {
                "fDate": fDate.getFullYear() + "-" + ('0' + (fDate.getMonth() + 1)).slice(-2) + "-01",
                "eDate": eDate.getFullYear() + "-" + ('0' + (eDate.getMonth() + 1)).slice(-2) + "-" + ('0' + eDate.getDate()).slice(-2)
            };
        data.tableName = "workshift";
        if (order) {
            data.order = order;
        }

console.log('workshiftView data:' + data);
//      getManageList(data);
        getWorkShiftList(data);
    } else if (document.getElementById("reportStateView").classList.contains("active")) {
//    if (document.getElementById("reportStateView").classList.contains("active")) {

        getReportList(data, order);
    } else if (document.getElementById("reportListView").classList.contains("active")) {
        data.tableName = "reportList";
        if (order) {
            data.orderType = order.substr(0, 1);
            data.order = order.substr(1);
        }
console.log('reportListView data:' + data);
        getManageList(data);
    } else if (document.getElementById("ictListView").classList.contains("active")) {
        data.tableName = "ictList";
        if (order) {
            data.orderType = order.substr(0, 1);
            data.order = order.substr(1);
        }
console.log('ictListView data:' + data);
//      getManageList(data);
        getIctList(data);
    } else if (document.getElementById("demandListView").classList.contains("active")) {
        data.tableName = "demandList";
        if (order) {
            data.orderType = order.substr(0, 1);
            data.order = order.substr(1);
        }
console.log('demandListView data:' + data);
//        getManageList(data);
        getDemandList(data);
    }
}

function reportCsvDownload() {
    //タブ判定 表示中のテーブルをCSVダウンロードの対象とする
    var tBody, tHead;
    if (document.getElementById("reportStateView").classList.contains("active")) {
        tBody = document.getElementById("reportStateBody");
        tHead = document.getElementById("reportStateView")
            .getElementsByTagName("thead")[0];
    } else if (document.getElementById("reportListView").classList.contains("active")) {
        tBody = document.getElementById("reportListBody");
        tHead = document.getElementById("reportListView")
            .getElementsByTagName("thead")[0];

    } else if (document.getElementById("ictListView").classList.contains("active")) {
        tBody = document.getElementById("ictListBody");
        tHead = document.getElementById("ictListView")
            .getElementsByTagName("thead")[0];
    } else if (document.getElementById("demandListView").classList.contains("active")) {
        tBody = document.getElementById("demandListBody");
        tHead = document.getElementById("demandListView")
            .getElementsByTagName("thead")[0];
    } else if (document.getElementById("workShiftView").classList.contains("active")) {
        tBody = document.getElementById("workShiftBody");
        tHead = document.getElementById("workShiftView")
            .getElementsByTagName("thead")[0];
    }

    downloadCsv("example.csv", tBody, tHead);
}

function fromToDays(year, month, day, addDays) {
    //年月日と何日後or何日前を指定
    var date, baseSec, addSec, targetSec;
    date = new Date(year, month - 1, day);
    baseSec = date.getTime();
    //日数 * 1日のミリ秒数
    addSec = addDays * 86400000;
    targetSec = baseSec + addSec;
    date.setTime(targetSec);
    return date;
}

function preset() {
//alert('preset');
console.log("preset() start");
    var date,
        dateSpan = {},
        days = -30;
    date = new Date();
    document.getElementById("yearDateFrom").value = date.getFullYear();
    document.getElementById("monthDateFrom").value = date.getMonth() + 1;
    document.getElementById("yearDateTo").value = date.getFullYear();
    document.getElementById("monthDateTo").value = date.getMonth() + 1;

    dateSpan["eDate"] = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    date = fromToDays(date.getFullYear(), (date.getMonth() + 1), date.getDate(), days);
    dateSpan["fDate"] = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    //console.log(dateSpan);
    /*
    dateSpan = {
        "tableName": "reportList",
        "fDate": "2015-09-01",
        "eDate": "2015-10-30"
    };
    getManageList(dateSpan);
    */

    dateObj = dateSpan;
//    stateView(dateObj);
    getReportList(dateObj);

    //dateSpanの中身が消えてしまうため変数に代入し実行
    //dateObj = dateSpan;
    //reportView(dateObj);

    //dateObj = dateSpan;
    //demandView(dateObj);

}

//window.addEventListener("load", setYearOptions, false);
window.addEventListener("load", preset, false);