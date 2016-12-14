var reportNameList = ["timetable", "location", "business",
                      "preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other",
                      "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
                      "unitE1Kokugo", "unitE1Math",
                      "unitE2Kokugo", "unitE2Math",
                      "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
                      "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
                      "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
                      "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
                      "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
                      "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
                      "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH"];

var ictNameList = ["lessonTimetable", "lessonLocation", "support", "lesson",
                   "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
                   "unitE1Kokugo", "unitE1Math",
                   "unitE2Kokugo", "unitE2Math",
                   "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
                   "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
                   "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
                   "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
                   "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
                   "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
                   "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH",
                   "purpose1", "purpose2", "purpose3", "purpose4", "purpose5",
                   "purpose6", "purpose7", "purpose8", "purpose9", "purpose10",
                   "equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6", "equipment7",
                   "application1", "application2", "application3", "application4", "application5",
                   "application6", "application7", "application8", "application9", "application10",
                   "application11", "application12", "application13"];

var demandNameList = ["title", "trouble", "equipment", "application", "status", "souceName", "memo"];

var filterPoint = ["group", "business", "curriculumE", "curriculumH", "trouble", "title"];
var filterName = {
    "group": ["", "E", "H"],
    "business": ["", "preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other"]
};
var filterCurriculum = {
    "E": {
        "1": ["", "Kokugo", "", "Math", ""],
        "2": ["", "Kokugo", "", "Math", ""],
        "3": ["", "Kokugo", "Syakai", "Math", "Rika"],
        "4": ["", "Kokugo", "Syakai", "Math", "Rika"],
        "5": ["", "Kokugo", "Syakai", "Math", "Rika"],
        "6": ["", "Kokugo", "Syakai", "Math", "Rika"]
    },
    "H": {
        "1": ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"],
        "2": ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"],
        "3": ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"]
    }
};

// ---- 2016-09-23 必要ないテーブル名が含まれている？要調査
var selectName = ["timetable", "location", "business", "item", "grade", "class", "curriculum", "unit"];
//var selectName = ["timetable", "location", "business", "unit"];
var ictSelectName = ["lessonTimetable", "lessonLocation", "support", "lesson", "grade", "class", "curriculum", "unit"];
//var ictSelectName = ["lessonTimetable", "lessonLocation", "support", "lesson", "unit"];
//----

var demandSelectName = ["title", "trouble", "equipment", "application", "status"];
var checkName = ["purpose", "equipment", "application"];
var textName = ["souceName", "memo"];

var reportItemNumCount = 0; //コピータイミング監視用
var ictItemNumCount = 0;
var troubleItemNumCount = 0;

//getItemDataで取得したデータを格納しておく
var itemListObj = {};

//selectの再設定
function reMakeSelect(e) {
    var targetEle, reName, reNameCode, trEles, tdEles, selectEles, parentEle, elementR, schoolCode, i, j;
//if (targetEle) {
//console.log('reMakeSelect() start targetEle:' + targetEle.name);
//}

    targetEle = e.target;
    //console.log(targetEle.name);
    var schoolFilter = ["school", "grade", "class", "curriculum"];
    if (targetEle.name === "group") {
        reNameCode = filterName[targetEle.name][targetEle.value];
        for (i = 0; i < schoolFilter.length; i++) {
            reName = schoolFilter[i] + reNameCode;
            if (document.getElementsByName(schoolFilter[i] + "").length) {
                selectEles = document.getElementsByName(schoolFilter[i] + "");
            } else if (document.getElementsByName(schoolFilter[i] + "E").length) {
                selectEles = document.getElementsByName(schoolFilter[i] + "E");
            } else if (document.getElementsByName(schoolFilter[i] + "H").length) {
                selectEles = document.getElementsByName(schoolFilter[i] + "H");
            }
            //console.log(selectEles);
            for (j = selectEles.length - 1; j >= 0; j--) {
                parentEle = selectEles[j].parentElement;
                parentEle.removeChild(selectEles[j]);
                selectEleEdit(parentEle, reName);
            }
        }
    } else if (targetEle.name === "business") {
        var rowNum, cellNum, reCellNum;
        reName = filterName[targetEle.name][targetEle.value];
        //headerの分戻す
        rowNum = targetEle.parentElement.parentElement.rowIndex - 1;
        //右隣りを参照
        cellNum = targetEle.parentElement.cellIndex;
        reCellNum = cellNum + 1;
        //右隣の要素の中身を削除し再設定
        elementR = targetEle.parentElement.parentElement.children[reCellNum];
        elementR.removeChild(elementR.firstElementChild);
        selectEleEdit(elementR, reName);
        elementR.firstElementChild.addEventListener("change", reMakeSelect, false);

        //学年・クラス・教科・単元を選択不可に設定
        targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
        targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
        targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
        targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
        targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
    } else if (targetEle.name === "preparationOfLesson") {
        if (targetEle.value == 2) {
            //学年・クラス・教科・単元を選択可に設定
            targetEle.parentElement.nextElementSibling.firstElementChild.disabled = false;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
        } else {
            //学年・クラス・教科・単元を選択不可に設定
            targetEle.parentElement.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.firstElementChild.disabled = true;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        }
    } else if (targetEle.name === "curriculumE" || targetEle.name === "curriculumH") {
        var gradeCode;
        trEles = targetEle.parentElement.parentElement;
        if (document.getElementsByName("group")[0].value === "1") {
            schoolCode = "E";
        } else if (document.getElementsByName("group")[0].value === "2") {
            schoolCode = "H";
        } else {
            schoolCode = "";
        }
        //schoolCode = filterName.group[trEles.firstElementChild.firstElementChild.value];
        //console.log(schoolCode);
        tdEles = trEles.children;
        for (i = 0; i < tdEles.length; i++) {
            if (tdEles[i].firstElementChild) {
                if (tdEles[i].firstElementChild.name === "grade" + schoolCode) {
                    gradeCode = tdEles[i].firstElementChild.value;
                }
            }
        }
        //console.log(schoolCode, gradeCode);
        if (schoolCode && gradeCode) {
            reName = "unit" + schoolCode + gradeCode + filterCurriculum[schoolCode][gradeCode][targetEle.value];
        } else {
            reName = "unit";
        }
        //console.log(reName);
        //右隣の要素の中身を削除し再設定
        elementR = targetEle.parentElement.nextSibling;
        elementR.removeChild(elementR.firstElementChild);
        selectEleEdit(elementR, reName);
    } else if (document.getElementById("demandReportView").classList.contains("active") && targetEle.name === "trouble") {
        //console.log(targetEle.parentElement.parentElement.parentElement.id);


        if (targetEle.value == 1) {
            //機器
            //ICT機器等を選択可に設定
            targetEle.parentElement.nextElementSibling.firstElementChild.disabled = false;
            //アプリ等を選択不可に設定
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        } else if (targetEle.value == 2) {
            //アプリ
            //ICT機器等を選択不可に設定
            targetEle.parentElement.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.firstElementChild.disabled = true;
            //アプリ等を選択可に設定
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
        } else {
            //選択なし、ネットワーク
            //ICT機器等、アプリ等を選択不可に設定
            targetEle.parentElement.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.firstElementChild.disabled = true;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        }
    } else if (document.getElementById("demandReportView").classList.contains("active") && targetEle.name === "title") {
        if (targetEle.value == 1) {
            targetEle.parentElement.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.firstElementChild.disabled = false;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
        } else {
            targetEle.parentElement.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.firstElementChild.disabled = true;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.selectedIndex = 0;
            targetEle.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        }
    }
    //console.log(targetEle.name);
}




function getItemList(selEle, tableEle) {
//alert('getItemList()')
//console.log("getItemList() start selEle.name:" + selEle.name);
//if (tableEle) {
//console.log("getItemList() tableEle.getAttribute(id):" + tableEle.getAttribute("id"));
//}

    var itemList, optionEle, xmlhr, response, i, j, id;
    var render = (function (response) {
        if (response != "null") {
//            itemList = JSON.parse(response);
            itemList = response;
            if (itemList != null) {
	            for (i = 0; i < itemList.length; i++) {
	                optionEle = document.createElement("option");
	                optionEle.value = i + 1;
	                optionEle.text = itemList[i].name;
	                selEle.appendChild(optionEle);
	            }
            }
            //個々にイベント登録
            for (i = 0; i < filterPoint.length; i++) {
                if (selEle.name === filterPoint[i]) {
//console.log("getItemList() filterPoint[" + i + "]" + filterPoint[i]);
//console.log("getItemList() addEventListener");
                    selEle.addEventListener("change", reMakeSelect, false);
                }
            }
            selEle.options[0].selected = true;
        }
        if (selEle.name.match(/unit(.*?)/)) {
            optionEle = document.createElement("option");
            optionEle.value = "0";
            optionEle.textContent = "その他";
            selEle.appendChild(optionEle);
        }
        if (tableEle) {
            id = tableEle.getAttribute("id")
            if (id == "reportBody") {
                reportItemNumCount += 1;
            } else if (id == "ictBody") {
                ictItemNumCount += 1;
            } else if (id == "demandBody") {
                troubleItemNumCount += 1;
            }
        }
    });

    if (itemListObj[selEle.name] !== undefined || itemListObj[selEle.name] == "null") {
        render(itemListObj[selEle.name]);
    } else {
//console.log("getItemList() get_item_list selEle.name:" + selEle.name);

        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "../api/item/get_item_list", false);
//        xmlhr.responseType = 'text';
        xmlhr.onreadystatechange = function () {
            if (xmlhr.readyState === 1) {
                //loading開始処理
                loadStart();
            }
            if (xmlhr.readyState === 4) {

//              response = JSON.parse(xmlhr.response);
                response = JSON.parse(xmlhr.responseText);
//              response = xmlhr.responseText;

//console.log("getItemList() get_item_list response[" + selEle.name + "]:" + response[selEle.name]);
                itemListObj[selEle.name] = response[selEle.name];

                render(response[selEle.name]);

                //loading終了処理
                loadEnd();
            }
        };
        //console.log(selEle.name);
        xmlhr.send(JSON.stringify({
            'array': [selEle.name]
        }));

    }




}




//親と名前を元にselectを作成
function selectEleEdit(parentEle, nameStr, tableEle) {
    var selEle, optionEle;
//console.log("selectEleEdit() start");

    selEle = document.createElement("select");
    selEle.className = "itemSelect";
    selEle.name = nameStr;

    optionEle = document.createElement("option");
    optionEle.value = "";
    if (nameStr === "schoolE" || nameStr === "schoolH" || nameStr === "school") {
        optionEle.textContent = "【学校名】";
    } else {
        optionEle.textContent = "--";
    }

    parentEle.appendChild(selEle);
    selEle.appendChild(optionEle);

    getItemList(selEle, tableEle);

    if (nameStr === "schoolE" || nameStr === "schoolH") {
        //報告済み内容の反映のためのイベントセット
        selEle.addEventListener("change", setReportItem, false);
        selEle.addEventListener("change", setIctItem, false);
        selEle.addEventListener("change", setDemandItem, false);
        document.getElementById("yearDate").addEventListener("change", setReportItem, false);
        document.getElementById("yearDate").addEventListener("change", setIctItem, false);
        document.getElementById("yearDate").addEventListener("change", setDemandItem, false);
        document.getElementById("monthDate").addEventListener("change", setReportItem, false);
        document.getElementById("monthDate").addEventListener("change", setIctItem, false);
        document.getElementById("monthDate").addEventListener("change", setDemandItem, false);
        document.getElementById("dayDate").addEventListener("change", setReportItem, false);
        document.getElementById("dayDate").addEventListener("change", setIctItem, false);
        document.getElementById("dayDate").addEventListener("change", setDemandItem, false);
    }
}

//親と名前を元にcheckboxを作成
function checkEleEdit(parentEle, nameStr) {
    var checkEle, lbEle, itemList, optionEle, pEle, xmlhr, response, i;

    var render = (function (response) {

        if (response !== "null") {
            itemList = response;
            pEle = document.createElement("p");
            for (i = 0; i < itemList.length; i++) {
                //チェックボックス生成
                checkEle = document.createElement("input");
                checkEle.className = "itemCheck";
                checkEle.name = nameStr + (i + 1);
                checkEle.type = "checkbox";
                checkEle.value = 1;
                checkEle.id = checkEle.type + checkEle.name + checkEle.value;
                pEle.appendChild(checkEle);

                //ラベル付加
                lbEle = document.createElement("label");
                lbEle.textContent = itemList[i].name;
                lbEle.setAttribute("for", checkEle.id);
                pEle.appendChild(lbEle);

                pEle.appendChild(document.createElement("br"));
            }
            parentEle.appendChild(pEle);
        }

    });

    if (itemListObj[nameStr] !== undefined || itemListObj[nameStr] !== "null") {
        render(itemListObj[nameStr]);
        ictItemNumCount += 1;
    } else {

        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "../api/item/get_item_list", true);
//        xmlhr.responseType = 'text';
        xmlhr.onreadystatechange = function () {
            if (xmlhr.readyState === 1) {
                //loading開始処理
                loadStart();
            }
            if (xmlhr.readyState === 4) {
                response = JSON.parse(xmlhr.responseText);
//                response = JSON.parse(xmlhr.response);
                itemListObj[nameStr] = response[nameStr];
                render(response[nameStr]);
                ictItemNumCount += 1;
                //loading終了処理
                loadEnd();
            }
        };
        xmlhr.send(JSON.stringify({
            'array': [nameStr]
        }));
    }
}

//一括してイベント登録
function addFilterEvent() {
    var filterClass, i, j;
    for (i = 0; i < filterPoint.length; i++) {
//console.log('addFilterEvent() filterPoint[i]:' + filterPoint[i]);
        filterClass = document.getElementsByName(filterPoint[i]);
        for (j = 0; j < filterClass.length; j++) {
//console.log('addFilterEvent() filterClass[j].name:' + filterClass[j].name);
            filterClass[j].addEventListener("change", reMakeSelect, false);
        }
    }
}

//入力済みの報告の反映
function setReportItem() {
    var dateData, dataItem, schoolValue, sendData, schoolType, dataArray, trEles, newNameList, rowNum, i, j,
        xmlhr, response,
        schoolValue = null;

//console.log('setReportItem() start');

    if (document.getElementById("yearDate").value && document.getElementById("monthDate").value && document.getElementById("dayDate").value) {
        if (document.getElementsByName("schoolE")[0]) {
            schoolValue = document.getElementsByName("schoolE")[0].value;
        } else if (document.getElementsByName("schoolH")[0]) {
            schoolValue = document.getElementsByName("schoolH")[0].value;
        } else {
            schoolValue = null;
        }
        if (document.getElementsByName("group")[0].value && schoolValue) {
            sendData = {};
            trEles = document.getElementById("reportBody").children;
            //入力内容をリセット
            for (i = 0; i < trEles.length; i++) {
                if (trEles[i].id) {
                    trEles[i].id = "";
                }
                for (j = 1; j < selectName.length; j++) {
                    trEles[i].children[j].firstElementChild.selectedIndex = 0;
                }
            }

            dateData = document.getElementById("yearDate").value + "-" + ('0' + document.getElementById("monthDate").value).slice(-2) + "-" + ('0' + document.getElementById("dayDate").value).slice(-2);

            if (document.getElementsByName("schoolE").length) {
                schoolType = "schoolE";
                schoolValue = document.getElementsByName("schoolE")[0].value;
            } else if (document.getElementsByName("schoolH").length) {
                schoolType = "schoolH";
                schoolValue = document.getElementsByName("schoolH")[0].value;
            }

            sendData.date = dateData;
            sendData.schoolType = schoolType;
            sendData.schoolValue = schoolValue;

            xmlhr = new XMLHttpRequest();
            xmlhr.open("POST", "../api/edit/load_report_item", true);
//            xmlhr.responseType = 'text';
            xmlhr.onreadystatechange = function () {
                if (xmlhr.readyState === 1) {
                    //loading開始処理
                    loadStart();
                }
                if (xmlhr.readyState === 4) {
                    response = xmlhr.responseText;
//                    response = xmlhr.response;
                    //console.log("sR:", response);
                    dataArray = JSON.parse(response);
                    if (dataArray) {
//alert('dataArray.length:' + dataArray.length);
                        for (i = 0; i < dataArray.length; i++) {
                            newNameList = [];
//alert(dataArray[i]);
//                            dataItem = JSON.parse(dataArray[i]);
                            dataItem = dataArray[i];

                            //nullのプロパティを削除
                            //nullがないものをSQLで返したほうが...
                            for (j = 0; j < reportNameList.length; j++) {
                                if (!dataItem[reportNameList[j]]) {
                                    delete dataItem[reportNameList[j]];
                                } else {
                                    newNameList.push(reportNameList[j]);
                                    //console.log(j);
                                }
                            }
                            //console.log(dataItem);
                            //console.log(newNameList);
                            rowNum = parseInt(dataItem.timetable) - 1;
                            trEles[rowNum].id = dataItem.id;
                            var forLength = newNameList.length;
                            for (j = 0; j < forLength; j++) {
                                if (j < 3) {
                                    if (document.getElementsByName(newNameList[j])[rowNum]) {
                                        //console.log(document.getElementsByName(newNameList[j])[i]);
                                        parentEle = document.getElementsByName(newNameList[j])[rowNum].parentElement;
                                        parentEle.removeChild(document.getElementsByName(newNameList[j])[rowNum]);
                                        //console.log(forLength);
//console.log("==== 1 ====");
                                        reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                        //document.getElementsByName(newNameList[j])[i].value = dataItem[newNameList[j]];
                                    }

                                } else if (j === 3) {
                                    parentEle = trEles[rowNum].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
//console.log("==== 2 ====");
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                    reportSelectDisable(parentEle, dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/grade(.*?)/)) {
                                    parentEle = trEles[rowNum].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
//console.log("==== 3 ====");
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/class(.*?)/)) {
                                    parentEle = trEles[rowNum].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
//console.log("==== 4 ====");
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/curriculum(.*?)/)) {
                                    parentEle = trEles[rowNum].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
//console.log("==== 5 ====");
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/unit(.*?)/)) {
                                    parentEle = trEles[rowNum].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
                                    //console.log(parentEle, newNameList[j], dataItem[newNameList[j]]);
//console.log("==== 6 ====");
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                }
                            }
                        }
                    }
//alert('setReportItem() loadEnd()');
                    //loading終了処理
                    loadEnd();
                }
            };
            //console.log(JSON.stringify(sendData));
            xmlhr.send(JSON.stringify(sendData));
        }
    }
}

//入力済みのICTの反映
function setIctItem() {
//alert('setIctItem()')
//console.log('setIctItem() start');

    var dateData, dataItem, schoolValue, sendData, schoolType, dataArray, trEles, newNameList, i, j,
        xmlhr, response,
        schoolValue = null;
    if (document.getElementById("yearDate").value && document.getElementById("monthDate").value && document.getElementById("dayDate").value) {
        if (document.getElementsByName("schoolE")[0]) {
            schoolValue = document.getElementsByName("schoolE")[0].value;
            schoolType = "schoolE";
        } else if (document.getElementsByName("schoolH")[0]) {
            schoolValue = document.getElementsByName("schoolH")[0].value;
            schoolType = "schoolH";
        } else {
            schoolValue = null;
        }
        if (document.getElementsByName("group")[0].value && schoolValue) {
            sendData = {};
            trEles = document.getElementById("ictBody").children;
            //入力内容をリセット
            for (i = 0; i < trEles.length; i++) {
                if (trEles[i].id) {
                    trEles[i].id = "";
                }
                for (j = 1; j < selectName.length; j++) {
                    trEles[i].children[j].firstElementChild.selectedIndex = 0;
                }
            }

            for (i = 0; i < document.getElementsByClassName("itemCheck").length; i++) {
                document.getElementsByClassName("itemCheck")[i].checked = false;
            }

            dateData = document.getElementById("yearDate").value + "-" + ('0' + document.getElementById("monthDate").value).slice(-2) + "-" + ('0' + document.getElementById("dayDate").value).slice(-2);

            sendData.date = dateData;
            sendData.schoolType = schoolType;
            sendData.schoolValue = schoolValue;

            xmlhr = new XMLHttpRequest();
            xmlhr.open("POST", "../api/edit/load_ict_item", true);
//            xmlhr.responseType = 'text';
            xmlhr.onreadystatechange = function () {
                if (xmlhr.readyState === 1) {
                    //loading開始処理
                    loadStart();
                }
                if (xmlhr.readyState === 4) {
//                    response = xmlhr.responseText;
                    response = xmlhr.response;
                    //console.log("sR:", response);
                    dataArray = JSON.parse(response);
//alert(dataArray);

                    if (dataArray) {
//alert(dataArray.length);
                        for (i = 0; i < dataArray.length; i++) {
                            newNameList = [];
//                            dataItem = JSON.parse(dataArray[i]);
                            dataItem = dataArray[i];
//alert(dataItem);

                            //nullのプロパティを削除
                            //nullがないものをSQLで返したほうが...
                            for (j = 0; j < ictNameList.length; j++) {
                                if (!dataItem[ictNameList[j]]) {
                                    delete dataItem[ictNameList[j]];
                                } else {
                                    newNameList.push(ictNameList[j]);
                                    //console.log(j);
                                }
                            }
                            //console.log(dataItem);
                            //console.log(newNameList);
                            trEles[i].id = dataItem.id;
                            var forLength = newNameList.length;
                            for (j = 0; j < forLength; j++) {
                                if (j < 3) {
                                    if (document.getElementsByName(newNameList[j])[i]) {
                                        //console.log(document.getElementsByName(newNameList[j])[i]);
                                        parentEle = document.getElementsByName(newNameList[j])[i].parentElement;
                                        parentEle.removeChild(document.getElementsByName(newNameList[j])[i]);
                                        //console.log(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                        reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                    }
                                } else if (newNameList[j].match(/lesson/)) {
                                    parentEle = trEles[i].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/grade(.*?)/)) {
                                    parentEle = trEles[i].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/class(.*?)/)) {
                                    parentEle = trEles[i].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/curriculum(.*?)/)) {
                                    parentEle = trEles[i].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/unit(.*?)/)) {
                                    parentEle = trEles[i].children[j];
                                    parentEle.removeChild(parentEle.firstElementChild);
                                    reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                } else if (newNameList[j].match(/purpose(.*?)/)) {
                                    document.getElementsByName(newNameList[j])[i].checked = true;
                                } else if (newNameList[j].match(/equipment(.*?)/)) {
                                    document.getElementsByName(newNameList[j])[i].checked = true;
                                } else if (newNameList[j].match(/application(.*?)/)) {
                                    document.getElementsByName(newNameList[j])[i].checked = true;
                                }
                            }
                        }
                    }
//alert('setIctItem() loadEnd()')
                    //loading終了処理
                    loadEnd();
                }
            };
            //console.log(JSON.stringify(sendData));
            xmlhr.send(JSON.stringify(sendData));
        }
    }
}

//入力済みの要望トラブルの反映
function setDemandItem() {
//alert('setDemandItem()')
//console.log('setDemandItem() start');

    var dateData, dataItem, schoolValue, sendData, schoolType, dataArray, trEles, newNameList, i, j,
        xmlhr, response,
        schoolValue = null;
    if (document.getElementById("yearDate").value && document.getElementById("monthDate").value && document.getElementById("dayDate").value) {
        if (document.getElementsByName("schoolE")[0]) {
            schoolValue = document.getElementsByName("schoolE")[0].value;
        } else if (document.getElementsByName("schoolH")[0]) {
            schoolValue = document.getElementsByName("schoolH")[0].value;
        } else {
            schoolValue = null;
        }
        if (document.getElementsByName("group")[0].value && schoolValue) {
            sendData = {};
            trEles = document.getElementById("demandBody").children;
            for (i = 0; i < trEles.length; i++) {
                if (trEles[i].id) {
                    trEles[i].id = "";
                }
                for (j = 0; j < demandSelectName.length; j++) {
                    trEles[i].children[j].firstElementChild.selectedIndex = 0;
                }
            }
            for (i = 0; i < document.getElementsByName("souceName").length; i++) {
                document.getElementsByName("souceName")[i].value = "";
            }
            for (i = 0; i < document.getElementsByName("memo").length; i++) {
                document.getElementsByName("memo")[i].value = "";
            }

            dateData = document.getElementById("yearDate").value + "-" + ('0' + document.getElementById("monthDate").value).slice(-2) + "-" + ('0' + document.getElementById("dayDate").value).slice(-2);

            if (document.getElementsByName("schoolE").length) {
                schoolType = "schoolE";
                schoolValue = document.getElementsByName("schoolE")[0].value;
            } else if (document.getElementsByName("schoolH").length) {
                schoolType = "schoolH";
                schoolValue = document.getElementsByName("schoolH")[0].value;
            }

            sendData.date = dateData;
            sendData.schoolType = schoolType;
            sendData.schoolValue = schoolValue;

            xmlhr = new XMLHttpRequest();
            xmlhr.open("POST", "../api/edit/load_demand_item", true);
//            xmlhr.responseType = 'text';
            xmlhr.onreadystatechange = function () {
                if (xmlhr.readyState === 1) {
                    //loading開始処理
                    loadStart();
                }
                if (xmlhr.readyState === 4) {
                    response = xmlhr.responseText;
//                    response = xmlhr.response;
                    //console.log("sD:",response);
                    dataArray = JSON.parse(response);
//alert(dataArray);
                    if (dataArray) {
//alert(dataArray.length);
                        for (i = 0; i < dataArray.length; i++) {
                            newNameList = [];
//                            dataItem = JSON.parse(dataArray[i]);
                            dataItem = dataArray[i];

                            //nullのプロパティを削除
                            //nullがないものをSQLで返したほうが...
                            for (j = 0; j < demandNameList.length; j++) {
                                if (!dataItem[demandNameList[j]]) {
                                    delete dataItem[demandNameList[j]];
                                } else {
                                    newNameList.push(demandNameList[j]);
                                }
                            }
                            //console.log(dataItem);
                            //console.log(newNameList);
                            trEles[i].id = dataItem.id;
                            var forLength = newNameList.length;
                            //console.log(newNameList);
                            for (j = 0; j < forLength; j++) {
                                //後ろ2つは情報元とメモ
                                if (j < forLength - 2) {
                                    if (document.getElementsByName(newNameList[j])[i]) {
                                        parentEle = document.getElementsByName(newNameList[j])[i].parentElement;
                                        parentEle.removeChild(document.getElementsByName(newNameList[j])[i]);
                                        //console.log(dataItem[newNameList[j]]);
                                        reSelectEleEdit(parentEle, newNameList[j], dataItem[newNameList[j]]);
                                        demandSelectDisable(parentEle, dataItem[newNameList[j]]);
                                    }
                                } else {
                                    document.getElementsByName(newNameList[j])[i].value = dataItem[newNameList[j]];
                                }
                            }
                        }
                    }
//alert('setDemandItem() loadEnd() s');
                    //loading終了処理
                    loadEnd();
//alert('setDemandItem() loadEnd() e');
                }
            };
            //console.log(JSON.stringify(sendData));
            xmlhr.send(JSON.stringify(sendData));
        }
    }
}

function defaultTrEdit(bodyEle, trEle, count) {
    var newTableBodyEle, i;
    newTableBodyEle = bodyEle.cloneNode(true);
    for (i = 0; i < count; i++) {
        newTableBodyEle.appendChild(trEle.cloneNode(true));
    }
    return newTableBodyEle;



    /*
        idSequence = 0,
        inputEles = document.getElementsByTagName("input");

    for (j = 0; j < inputEles.length; j++) {
        if (inputEles[j].type === "checkbox" && inputEles[j].nextElementSibling.tagName.toLowerCase() === "label") {
            inputEles[j].id = "checkbox" + idSequence;
            inputEles[j].nextElementSibling.setAttribute("for", inputEles[j].id);
            idSequence++;
        }
    }
    */
}


function ictReportEditor() {
//alert('ictReportEditor()');
//console.log('ictReportEditor() start');
    var tableBodyEle, trEle, tdEle, itemName, i, j;


    tableBodyEle = document.getElementById("ictBody");

    trEle = document.createElement("tr");
    //ictのselectの項目の生成
    itemName = ictSelectName;
//console.log('ictReportEditor() itemName:' + itemName);
    for (i = 0; i < itemName.length; i++) {
        tdEle = document.createElement("td");
        selectEleEdit(tdEle, itemName[i], tableBodyEle);
        trEle.appendChild(tdEle);
    }
    //ictのcheckの項目の生成
    itemName = checkName;
    for (i = 0; i < itemName.length; i++) {
        tdEle = document.createElement("td");
        checkEleEdit(tdEle, itemName[i]);
        trEle.appendChild(tdEle);
    }

    var loadInfo = setInterval(function () {
        var idSequence, inputEles;
        //console.log(ictItemNumCount);
        if (ictItemNumCount === (ictSelectName.length + checkName.length)) {
            //ict表示場所
            tableBodyEle.parentElement.replaceChild(defaultTrEdit(tableBodyEle, trEle, 20), tableBodyEle);
            idSequence = 0;
            inputEles = document.getElementsByTagName("input");
            for (j = 0; j < inputEles.length; j++) {
                if (inputEles[j].type === "checkbox" && inputEles[j].nextElementSibling.tagName.toLowerCase() === "label") {
                    inputEles[j].id = "checkbox" + idSequence;
                    inputEles[j].nextElementSibling.setAttribute("for", inputEles[j].id);
                    idSequence++;
                }
            }
            addFilterEvent();

            clearInterval(loadInfo);
        }
    }, 100);
}

function troubleReportEditor() {
    var tableBodyEle, trEle, tdEle, itemName, textArea, i, j;
//console.log('troubleReportEditor() start');

    tableBodyEle = document.getElementById("demandBody");

    trEle = document.createElement("tr");
    //demandのselectの項目の生成
    itemName = demandSelectName;
    for (i = 0; i < itemName.length; i++) {
        tdEle = document.createElement("td");
        selectEleEdit(tdEle, itemName[i], tableBodyEle);
        trEle.appendChild(tdEle);
    }

    //demandのtextareaの項目の生成
    itemName = textName;
    for (i = 0; i < itemName.length; i++) {
        textArea = document.createElement("textarea");
        textArea.name = itemName[i];
        textArea.className = "itemSelect";
        if (i === 0) {
            textArea.maxLength = 10;
        } else if (i === 1) {
            textArea.maxLength = 200;
        }
        tdEle = document.createElement("td");
        trEle.appendChild(tdEle);
        tdEle.appendChild(textArea);
        troubleItemNumCount += 1;
    }

    var loadInfo = setInterval(function () {
        var idSequence, inputEles;
        if (troubleItemNumCount === (demandSelectName.length + textName.length)) {
            //demand表示場所
            tableBodyEle.parentElement.replaceChild(defaultTrEdit(tableBodyEle, trEle, 10), tableBodyEle);

            addFilterEvent();

            clearInterval(loadInfo);
        }
    }, 100);
}

//ロード時に指定数のtable行を追加
function reportEditor() {
    var itemName, itemListArray, tableBodyEle, newTableBodyEle, trEle, tdEle, xmlhr, response, i, j;
console.log('reportEditor() start');


    var mergeArray = selectName.concat(ictSelectName);
    mergeArray = mergeArray.concat(demandSelectName);
    mergeArray = mergeArray.concat(checkName);
    mergeArray = mergeArray.concat(['maintenance', 'business']);


    // mergeArray=mergeArray.filter((x, i, self) => self.indexOf(x) === i);
    // var mergeArray=["timetable","application","area","business","classE","classH","curriculumE","curriculumH","dtTitle","equipment","gradeE","gradeH","group","lesson","lessonAfter","location","maintenance","other","preparationOfLesson","purpose","schoolE","schoolH","status","trouble"];
    //必要なテーブルデータは一度のAJAXで全て取得しておく
    $.when(

            $.ajax({
                url: "../api/item/get_item_list",
                type: 'POST',
                datatype: 'JSON',
                data: JSON.stringify({
                    'array': mergeArray
                }),
            })
            .done(function (data) {
//alert(data);
//                itemListObj = JSON.parse(data);
              itemListObj = data;
            })
        )
        .done(function () {

            //業務報告入力画面の生成
            itemName = selectName;

//alert(itemListObj);
//            itemListArray = JSON.parse(itemListObj['timetable']);
//          itemListArray = JSON.parse(itemListObj.timetable);
          itemListArray = itemListObj['timetable'];
//alert(itemListArray);
            //input表示場所
            tableBodyEle = document.getElementById("reportBody");
            newTableBodyEle = tableBodyEle.cloneNode(true);
            for (i = 0; i < itemListArray.length; i++) {
                trEle = document.createElement("tr");
                tdEle = document.createElement("td");
                tdEle.textContent = itemListArray[i].name;
                tdEle.className = itemName[0];
                trEle.appendChild(tdEle);
                for (j = 1; j < itemName.length; j++) {
                    tdEle = document.createElement("td");
                    selectEleEdit(tdEle, itemName[j]);
                    trEle.appendChild(tdEle);
                    newTableBodyEle.appendChild(trEle);
                }
            }
            //要素の置き換えで反映
            tableBodyEle.parentElement.replaceChild(newTableBodyEle, tableBodyEle);
            addFilterEvent();

            //その他タブを生成
            ictReportEditor();
            troubleReportEditor();

        })

    //強制的に再描画（ドロップダウンリストが開かなくなる問題への対策）
    setTimeout(function () {
        var someEle = document.getElementById("headerImg1");
        var displayMode = someEle.style.display;
        someEle.style.display = "none";
        var redrawFix = someEle.offsetHeight;
        someEle.style.display = displayMode;
    }, 1000);

    //画面上の学校種類selectにイベント追加
    document.getElementsByName("group")[0].addEventListener("change", reMakeSelect, false);
}

window.addEventListener("load", reportEditor, false);