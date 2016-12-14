var businessItemList = ["preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other"];
var unitItemList = ["unitE1Kokugo", "unitE1Math",
                    "unitE2Kokugo", "unitE2Math",
                    "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
                    "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
                    "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
                    "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
                    "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
                    "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
                    "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH"];
var purposeItemList = ["purpose1", "purpose2", "purpose3", "purpose4", "purpose5",
                       "purpose6", "purpose7", "purpose8", "purpose9", "purpose10"];
var equipmentItemList = ["equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6", "equipment7"];
var applicationItemList = ["application1", "application2", "application3", "application4", "application5",
                           "application6", "application7", "application8", "application9", "application10",
                           "application11", "application12", "application13"];

function reportList(dataArray) {
    var tBodyEle, newTBodyEle, trEle, tdEle, data, i, j;
    tBodyEle = document.getElementById("reportListBody");
    newTBodyEle = document.createElement("tbody");
    newTBodyEle.id = "reportListBody";

    for (i = 0; i < dataArray.length; i++) {
        data = JSON.parse(dataArray[i]);
        trEle = document.createElement("tr");

        //日付
        tdEle = document.createElement("td");
        tdEle.textContent = data["date"];
        trEle.appendChild(tdEle);

        //氏名
        tdEle = document.createElement("td");
        tdEle.textContent = data["user"];
        trEle.appendChild(tdEle);

        //学校
        tdEle = document.createElement("td");
        if (data["schoolE"]) {
            tdEle.textContent = data["schoolE"];
        } else if (data["schoolH"]) {
            tdEle.textContent = data["schoolH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //時間割
        tdEle = document.createElement("td");
        tdEle.textContent = data["timetable"];
        trEle.appendChild(tdEle);

        //場所
        tdEle = document.createElement("td");
        tdEle.textContent = data["location"];
        trEle.appendChild(tdEle);

        //業務
        tdEle = document.createElement("td");
        tdEle.textContent = data["business"];
        trEle.appendChild(tdEle);

        //項目
        tdEle = document.createElement("td");
        for (j = 0; j < businessItemList.length; j++) {
            if (data[businessItemList[j]]) {
                tdEle.textContent = data[businessItemList[j]];
            }
        }
        trEle.appendChild(tdEle);

        //学年
        tdEle = document.createElement("td");
        if (data["gradeE"]) {
            tdEle.textContent = data["gradeE"];
        } else if (data["gradeH"]) {
            tdEle.textContent = data["gradeH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //クラス
        tdEle = document.createElement("td");
        if (data["classE"]) {
            tdEle.textContent = data["classE"];
        } else if (data["classH"]) {
            tdEle.textContent = data["classH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //教科
        tdEle = document.createElement("td");
        if (data["curriculumE"]) {
            tdEle.textContent = data["curriculumE"];
        } else if (data["curriculumH"]) {
            tdEle.textContent = data["curriculumH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //単元
        tdEle = document.createElement("td");
        for (j = 0; j < unitItemList.length; j++) {
            if (data[unitItemList[j]]) {
                tdEle.textContent = data[unitItemList[j]];
            }
        }
        trEle.appendChild(tdEle);

        newTBodyEle.appendChild(trEle);
    }
    tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle);
}


/*
function getManageList(date) {
    var xmlhr, response;
console.log("getManageList() date:" + date);

    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/load_list_manage", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            if (response) {
                //console.log(response);
                //console.log(date);
                //console.log("rDL:", JSON.parse(response));
                if (date.tableName === "reportList") {
                    reportList(JSON.parse(response));
                    //console.log(JSON.parse(response));
                } else if (date.tableName === "ictList") {
                    ictList(JSON.parse(response));
                    //console.log(JSON.parse(response));
                } else if (date.tableName === "demandList") {
console.log('1 getManageList() demandList JSON.parse(response):' + JSON.parse(response));
                    demandList(JSON.parse(response));
//                    demandList(response);
console.log('2 getManageList() demandList JSON.parse(response):' + JSON.parse(response));
                }
            }
            //loading終了処理
            loadEnd();
        }
    };
    //console.log(JSON.stringify(date));
    xmlhr.send(JSON.stringify(date));
}
*/