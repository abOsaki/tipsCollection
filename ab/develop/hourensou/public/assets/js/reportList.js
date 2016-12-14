function getReportList(dateSpan, order) {
//function stateView(dateSpan, order) {
    var tBodyEle, newTBodyEle, trEle, tdEle, linkEle, dataList, nextData, fDate, eDate, yDate, i, j, k,
        xmlhr, response,
        sendData = {},
        reportNameList = [],
        reportDate = [],
        userFlag = false;

    fDate = new Date(dateSpan.fDate);
    eDate = new Date(dateSpan.eDate);
    //一日前の日付
    yDate = fromToDays(eDate.getFullYear(), eDate.getMonth() + 1, eDate.getDate(), -1);

    sendData.fDate = dateSpan.fDate;
    sendData.eDate = dateSpan.eDate;
    sendData.order = order;

    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/get_loadstate", true);
//    xmlhr.responseType = 'text';
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
//      response = xmlhr.response;
            if (response != null) {
//console.log("stateView() response:" + response);
//console.log("stateView() response jsonString:" + JSON.stringify(response));
                dataList = JSON.parse(response);
//              dataList = response;
//console.log("stateView() dataList:" + dataList);
                tBodyEle = document.getElementById("reportStateBody");

                newTBodyEle = document.createElement("tbody");
                newTBodyEle.id = "reportStateBody";

                for (i = 0; i < dataList.length; i++) {
//console.log("stateView() i:" + i);
                    var data = dataList[i];
//console.log("stateView() data:" + data);
                    var reportDone = false;
//console.log("stateView() data.date:" + data.date);

                    trEle = document.createElement("tr");

                    //日付
                    tdEle = document.createElement("td");
                    tdEle.textContent = data.date;
                    trEle.appendChild(tdEle);

                    //日付変更時のボーダー
                    if (order == null && i > 0 && data.date != newTBodyEle.children[i - 1].firstElementChild.textContent) {
                        trEle.style.borderTop = "solid 2px #000000";
                    }

                    //曜日
                    tdEle = document.createElement("td");
                    tdEle.textContent = DAY_OF_WEEK[data.dayOfWeek];
                    trEle.appendChild(tdEle);

                    //学校
                    tdEle = document.createElement("td");
                    if (data.schoolE) {
                        tdEle.textContent = data.schoolE;
                    } else if (data.schoolH) {
                        tdEle.textContent = data.schoolH;
                    } else {
                        tdEle.textContent = "";
                    }
                    trEle.appendChild(tdEle);

                    //氏名
                    tdEle = document.createElement("td");
                    tdEle.textContent = data.name;
                    trEle.appendChild(tdEle);
                    //                reportNameList.push(dataList[i].name);

                    //業務報告
                    tdEle = document.createElement("td");
                    if (data.reportDone == 1) {
                        tdEle.textContent = "済";
                        reportDone = true;
                    } else {
                        tdEle.textContent = "未";
                        tdEle.style.color = "#ff0000";
                    }
                    trEle.appendChild(tdEle);

                    //ICT活用
                    tdEle = document.createElement("td");
                    if (data.lReportDone == 1) {
                        tdEle.textContent = "あり";
                    } else if (reportDone) {
                        tdEle.textContent = "なし";
                    }
                    trEle.appendChild(tdEle);

                    //要望トラブル
                    tdEle = document.createElement("td");
                    if (data.tReportDone == 1) {
                        tdEle.textContent = "あり";
                    } else if (reportDone) {
                        tdEle.textContent = "なし";
                    }
                    trEle.appendChild(tdEle);

                    //空きスペース
                    tdEle = document.createElement("td");
                    trEle.appendChild(tdEle);

                    newTBodyEle.appendChild(trEle);
                }
                tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle);
            }
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(sendData));
}