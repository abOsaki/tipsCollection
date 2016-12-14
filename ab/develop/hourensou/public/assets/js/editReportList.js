var tableName = ["purpose", "equipment", "application"];
//purpose,equipment,application変換リスト
var peaReplace = {
    60: {
        "1": "作品を作る",
        "2": "練習する",
        "3": "調べる",
        "4": "話し合う",
        "5": "見比べる",
        "6": "観察・記録する",
        "7": "考えをまとめる",
        "8": "発表する",
        "9": "見せる",
        "10": "その他"
    },
    67: {
        "1": "電子黒板",
        "2": "教員機",
        "3": "タブレット",
        "4": "プロジェクタ",
        "5": "書画カメラ",
        "6": "プリンタ",
        "7": "その他"
    },
    80: {
        "1": "Active School",
        "2": "Degital School Note",
        "3": "Active Web Board",
        "4": "Power Point",
        "5": "Word",
        "6": "Excel",
        "7": "Internet Explorer",
        "8": "カメラ(写真)",
        "9": "カメラ(動画)",
        "10": "ドリル教材",
        "11": "デジタル教科書",
        "12": "あなうめ君",
        "13": "その他"
    }
};

var dbNameList;

/*
function getNameList() {
    var xmlhr, response;

    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/get_name_list", true);

    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            //console.log(response);
            if (response !== null) {
//                dbNameList = JSON.parse(response);
              dbNameList = response;
                //console.log(nameList);
            }

            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(tableName));
}
*/

function getReportList(date) {
    var xmlhr, response, i, j, reportList, report, table, rows = [],
        cell, value, text, index1, index2;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/get_list", true);
//    xmlhr.responseType = 'text';

    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
//            response = xmlhr.response;
            //console.log(response);
            if (response !== null) {
                reportList = JSON.parse(response);
//                reportList = response;
//console.log(reportList);

                table = document.getElementById("reportListBody").parentElement;

                for (i = 0; i < reportList.length; i++) {
                    rows.push(table.insertRow(-1));
//                    report = JSON.parse(reportList[i]);
                    report = reportList[i];
//console.log(JSON.stringify(report));

//                    if (i == 0) {
//                        console.log(report);
//                    }

                    var emptyFlag;

                    for (j = 0; j < report.length; j++) {
                        text = report[j];
//console.log(text);

                        if (text != null) {
                            cell = rows[i].insertCell(-1);
                            cell.appendChild(document.createTextNode(text));

                            emptyFlag = false;
                        }

                        switch (j) {
                        case 11:
                            emptyFlag = true;
                            break;

                        case 4: // 場所
                            if (text == null) {
                                cell = rows[i].insertCell(-1);
                                cell.appendChild(document.createTextNode("-"));

                                emptyFlag = false;
                            }


                        case 13: // 学年
                        case 15: // クラス
                        case 17: // 教科
                        case 55: // 単元

                            if (emptyFlag == true) {
                                cell = rows[i].insertCell(-1);
                                cell.appendChild(document.createTextNode("-"));
                            }
                            emptyFlag = true;
                            break;
                        }
                    }
                }
            }
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(date));
}

// TODO
function getIctReportList(date) {
console.log('getIctReportList() start');

//alert('getIctReportList');
    var xmlhr, response, i, j, reportList, report, table, rows = [],
        cell, value, text, emptyCheck, emptyFlag, index1, index2;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/get_ict_list", true);
//    xmlhr.responseType = 'text';

    xmlhr.onreadystatechange = function () {
console.log('getIctReportList() xmlhr.readyState:' + xmlhr.readyState);
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
//            response = xmlhr.response;
console.log('getIctReportList() response:' + response);
            if (response !== null) {
                reportList = JSON.parse(response);
console.log('getIctReportList() reportList:' + reportList);

                table = document.getElementById("ictListBody").parentElement;

                for (i = 0; i < reportList.length; i++) {
                    rows.push(table.insertRow(-1));
//                    report = JSON.parse(reportList[i]);
                    report = reportList[i];

                    //console.log(report);
//                    if (i == 0) {
//                        console.log(report);
//                    }

                    var emptyFlag;
                    var j;
                    for (j = 0; j <= 50; j++) {
                        //console.log(j);
                        text = report[j];

                        if (text != null) {
                            cell = rows[i].insertCell(-1);
                            cell.appendChild(document.createTextNode(text));

                            emptyFlag = false;
                        }

                        switch (j) {
                        case 6:
                            emptyFlag = true;
                            break;

                        case 8: // 学年
                        case 10: // クラス
                        case 12: // 教科
                        case 50: // 単元

                            if (emptyFlag == true) {
                                cell = rows[i].insertCell(-1);
                                cell.appendChild(document.createTextNode("-"));
                            }
                            emptyFlag = true;
                            break;
                        }
                    }

                    var str = "";
                    var checkBoxNum = 1;
                    for (; j < report.length; j++) {

                        if (report[j] == "1") {
                            if (str != "") {
                                str += ",";
                            }
                            str += checkBoxNum;
                        }

                        checkBoxNum++;

                        switch (j) {
                        case 60:
                        case 67:
                        case 80:
                            if (str != "") {
                                cell = rows[i].insertCell(-1);
                                var strArray = str.split(",");
                                var strRe = "";
                                for (var k = 0; k < strArray.length; k++) {
                                    //console.log(j, peaReplace[j][strArray[k]]);
                                    strRe += peaReplace[j][strArray[k]];
                                    if (k !== strArray.length - 1) {
                                        strRe += ", ";
                                    }
                                }

                                cell.appendChild(document.createTextNode(strRe));
                                //cell.appendChild(document.createTextNode(str));
                            } else {
                                cell = rows[i].insertCell(-1);
                                cell.appendChild(document.createTextNode("-"));
                            }
                            str = "";
                            strRe = "";
                            checkBoxNum = 1;
                            break;
                        }
                    }
                }
            }
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(date));
}

function isEmpty(text, index) {
    if (text == null) {
        if (index == 17 || index == 52) {
            return true;
        }
    }
    return false;
}

/*
function loadEvent(e) {
//console.log('2 loadEvent() start');
    // 当月1日
    var fDate = new Date();
    fDate.setDate(1);

    // 当月末日
    var eDate = new Date();
    eDate.setDate(1);
    eDate.setMonth(eDate.getMonth() + 1);
    eDate.setDate(eDate.getDate() - 1);

    document.getElementById("dispYear").textContent = fDate.getFullYear();
    document.getElementById("dispMonth").textContent = fDate.getMonth() + 1;

    var dateSpan = {
        "fDate": fDate.getFullYear() + "-" + ('0' + (fDate.getMonth() + 1)).slice(-2) + "-01",
        "eDate": eDate.getFullYear() + "-" + ('0' + (eDate.getMonth() + 1)).slice(-2) + "-" + ('0' + eDate.getDate()).slice(-2)
    };

    //console.log(dateSpan);
    getReportList(dateSpan);
    getNameList();
}
window.addEventListener("load", loadEvent, false);
*/