//データ保存
function saveInputData(data) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/save_report", true);
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            //console.log("resR:" + response);
            location.href = "../result/";
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(data));
}

//データ保存
function saveDemandData(data) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/save_demand", true);
//    xmlhr.responseType = 'text';
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
//            response = xmlhr.responseText;
            response = xmlhr.response;
            //console.log("resD:" + response);
            //loading終了処理
            loadEnd();
        }
    };
    //console.log("saveDemand",data)
    xmlhr.send(JSON.stringify(data));
}

//データ保存
function saveIctData(data) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/save_ict", true);
//    xmlhr.responseType = 'text';
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
//            response = xmlhr.responseText;
            response = xmlhr.response;
            //console.log("resD:" + response);
            //loading終了処理
            loadEnd();
        }
    };
    //console.log("saveICT",data);
    xmlhr.send(JSON.stringify(data));
}

//データ用意して送信funcを実行
function reportFrmSubmit() {
//alert('frmSubmit()');
    var trEles, saveData = [],
        itemData, itemEle, reportEle, demandEle, ictEle, itemTitle, itemTitle, i, j, schoolEle, errMes = [];
    if (document.getElementsByName("school").length) {
        schoolEle = document.getElementsByName("school");
    } else if (document.getElementsByName("schoolE").length) {
        schoolEle = document.getElementsByName("schoolE");
    } else if (document.getElementsByName("schoolH").length) {
        schoolEle = document.getElementsByName("schoolH");
    }

    if (document.getElementsByName("group")[0].value == 0 || !schoolEle[0].value) {
        //console.log(document.getElementsByName("group")[0].value);
        //console.log(schoolEle[0].value);

        if (document.getElementsByName("group")[0].value == 0) {
            document.getElementsByName("group")[0].style.backgroundColor = "#FFC0C0";
        }

        if (!schoolEle[0].value) {
            schoolEle[0].style.backgroundColor = "#FFC0C0";
        }

        alert("学校が未選択です");
        return;
    }
    document.getElementsByName("group")[0].style.backgroundColor = "#FFFFFF";
    schoolEle[0].style.backgroundColor = "#FFFFFF";

    //業務報告保存
    errMes[0] = "＜業務報告＞\n";
    saveData[0] = [];
    reportEle = document.getElementById("reportBody");
    //一行ごとにデータ取得
    for (i = 0; i < reportEle.childElementCount; i++) {
        itemData = {};
        trEles = reportEle.children[i];

        //完全に空行であればスルー
        if (!hasData(trEles)) {
            continue;
        }

        var checkList = ["location", "business", "item", "preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other", "grade", "class", "curriculum"];

        if (trEles.id) {
            //console.log("RtrId:" + trEles.id);
            itemData["id"] = trEles.id;
        } else {
            //console.log("Rid:null;");
            itemData["id"] = "";
        }
        //itemData["date"] = new Date(document.getElementById("yearDate").value,document.getElementById("monthDate").value,document.getElementById("dayDate").value);
        itemData["date"] = document.getElementById("yearDate").value + "-" + document.getElementById("monthDate").value + "-" + document.getElementById("dayDate").value;
        itemData["group"] = document.getElementsByName("group")[0].value;
        if (itemData["group"] === "1" && document.getElementsByName("schoolE")[0].value) {
            itemData["schoolE"] = document.getElementsByName("schoolE")[0].value;
            checkList[9] = "gradeE";
            checkList[10] = "classE";
            checkList[11] = "curriculumE";
        } else if (itemData["group"] === "2" && document.getElementsByName("schoolH")[0].value) {
            itemData["schoolH"] = document.getElementsByName("schoolH")[0].value;
            checkList[9] = "gradeH";
            checkList[10] = "classH";
            checkList[11] = "curriculumH";
        }
        //一行内のselectのValueを取得
        itemSelectEles = trEles.getElementsByClassName("itemSelect");
        //データが格納されるかフラグ管理
        var validFlag = true;
        for (j = 0; j < itemSelectEles.length; j++) {
            itemEle = itemSelectEles[j];

            if (itemEle.value) {
                itemTitle = itemEle.name;
                itemData[itemTitle] = itemEle.value;
                //itemNullFlag = true;
            } else if (checkList.indexOf(itemEle.name) >= 0) {
                trEles.children[j + 1].style.backgroundColor = "#FFC0C0";
                validFlag = false;
            }

            if (j == 2 && (itemEle.name != "preparationOfLesson" || itemEle.value != 2))
                break;
        }

        itemData["timetable"] = i + 1 + "";
        if (validFlag == true) {
            saveData[0].push(JSON.stringify(itemData));
        } else {
            errMes[0] += (i + 1) + "行目\n";
        }
    }

    //errMes[0] != "＜業務報告＞\n" && errMes[0] != "\n\n＜業務報告＞\n"
    if (errMes[0] != "＜業務報告＞\n") {
        errMes[0] += "必須項目が未入力です。";
        errMes[1] = "\n\n";
    } else {
        errMes[0] = "";
        errMes[1] = "";
    }

    errMes[1] += "＜ICT活用授業報告＞\n";
    saveData[1] = [];
    ictEle = document.getElementById("ictBody");
    //一行ごとにデータ取得
    for (i = 0; i < ictEle.childElementCount; i++) {
        var checked = 0;
        itemData = {};
        trEles = ictEle.children[i];

        //完全に空行であればスルー
        if (!hasData(trEles)) {
            continue;
        }

        var checkList = ["lessonTimetable", "lessonLocation", "support", "lesson", "grade", "class", "curriculum"];

        if (trEles.id) {
            //console.log("RtrId:" + trEles.id);
            itemData["id"] = trEles.id;
        } else {
            //console.log("Rid:null;");
            itemData["id"] = "";
        }
        //itemData["date"] = new Date(document.getElementById("yearDate").value,document.getElementById("monthDate").value,document.getElementById("dayDate").value);
        itemData["date"] = document.getElementById("yearDate").value + "-" + document.getElementById("monthDate").value + "-" + document.getElementById("dayDate").value;
        itemData["group"] = document.getElementsByName("group")[0].value;
        if (itemData["group"] === "1" && document.getElementsByName("schoolE")[0].value) {
            itemData["schoolE"] = document.getElementsByName("schoolE")[0].value;
            checkList[4] = "gradeE";
            checkList[5] = "classE";
            checkList[6] = "curriculumE";
        } else if (itemData["group"] === "2" && document.getElementsByName("schoolH")[0].value) {
            itemData["schoolH"] = document.getElementsByName("schoolH")[0].value;
            checkList[4] = "gradeH";
            checkList[5] = "classH";
            checkList[6] = "curriculumH";
        }
        //一行内のselectのValueを取得
        itemSelectEles = trEles.getElementsByClassName("itemSelect");
        //データが格納されるかフラグ管理
        var validFlag = true;
        for (j = 0; j < itemSelectEles.length; j++) {
            itemEle = itemSelectEles[j];

            if (itemEle.value) {
                itemTitle = itemEle.name;
                itemData[itemTitle] = itemEle.value;
                //itemNullFlag = true;
            } else if (checkList.indexOf(itemEle.name) >= 0) {
                trEles.children[j].style.backgroundColor = "#FFC0C0";
                validFlag = false;
            }
        }

        itemCheckEles = trEles.getElementsByClassName("itemCheck");

        for (j = 0; j < itemCheckEles.length; j++) {
            itemEle = itemCheckEles[j];
            itemTitle = itemEle.name;

            if (itemEle.checked == true) {
                itemData[itemTitle] = "1";

                if (itemTitle.indexOf("purpose") != -1) {
                    checked++;
                }
            }
        }

        if (checked == 0) {
            trEles.children[itemSelectEles.length].style.backgroundColor = "#FFC0C0";
            validFlag = false;
        }

        if (validFlag == true) {
            saveData[1].push(JSON.stringify(itemData));
        } else {
            errMes[1] += (i + 1) + "行目\n";
        }
    }
    if (errMes[1] != "＜ICT活用授業報告＞\n" && errMes[1] != "\n\n＜ICT活用授業報告＞\n") {
        //if (errMes[1] != "\n\n＜ICT活用授業報告＞\n") {
        errMes[1] += "必須項目が未入力です。";
        errMes[2] = "\n\n";
    } else {
        errMes[1] = "";
        errMes[2] = "";
    }

    errMes[2] += "＜要望・トラブル等報告＞\n";
    saveData[2] = [];
    demandEle = document.getElementById("demandBody");
    //一行ごとにデータ取得
    for (i = 0; i < demandEle.childElementCount; i++) {
        itemData = {};
        trEles = demandEle.children[i];

        //完全に空行であればスルー
        if (!hasData(trEles)) {
            continue;
        }

        if (trEles.id) {
            //console.log("RtrId:" + trEles.id);
            itemData["id"] = trEles.id;
        } else {
            //console.log("Rid:null;");
            itemData["id"] = "";
        }
        //itemData["date"] = new Date(document.getElementById("yearDate").value,document.getElementById("monthDate").value,document.getElementById("dayDate").value);
        itemData["date"] = document.getElementById("yearDate").value + "-" + document.getElementById("monthDate").value + "-" + document.getElementById("dayDate").value;
        itemData["group"] = document.getElementsByName("group")[0].value;
        if (itemData["group"] === "1" && document.getElementsByName("schoolE")[0].value) {
            itemData["schoolE"] = document.getElementsByName("schoolE")[0].value;
        } else if (itemData["group"] === "2" && document.getElementsByName("schoolH")[0].value) {
            itemData["schoolH"] = document.getElementsByName("schoolH")[0].value;
        }
        //一行内のselectのValueを取得
        itemSelectEles = trEles.getElementsByClassName("itemSelect");

        var checkList = [];
        //console.log(itemSelectEles.title.value);
        if (itemSelectEles.title.value == 1) {
            checkList = ["title", "status", "souceName", "memo"];
        } else {
            checkList = ["title", "souceName", "memo"];
        }
        //console.log(checkList);
        //データが格納されるかフラグ管理
        var validFlag = true;
        for (j = 0; j < itemSelectEles.length; j++) {
            itemEle = itemSelectEles[j];

            if (itemEle.value) {
                itemTitle = itemEle.name;
                itemData[itemTitle] = itemEle.value;
                //itemNullFlag = true;
            } else if (checkList.indexOf(itemEle.name) >= 0) {
                trEles.children[j].style.backgroundColor = "#FFC0C0";
                validFlag = false;
            }
        }

        if (validFlag == true) {
            saveData[2].push(JSON.stringify(itemData));
        } else {
            errMes[2] += (i + 1) + "行目\n";
        }
    }

    if (errMes[2] != "＜要望・トラブル等報告＞\n" && errMes[2] != "\n\n＜要望・トラブル等報告＞\n") {
        errMes[2] += "必須項目が未入力です。";
    } else {
        errMes[2] = "";
    }
    if (errMes[0] + errMes[1] + errMes[2] == "") {
        window.onbeforeunload = null;

        saveInputData(saveData[0]);
        saveIctData(saveData[1]);
        saveDemandData(saveData[2]);
    } else {
        //console.log(saveData[0], saveData[1], saveData[2]);
        alert(errMes[0] + errMes[1] + errMes[2]);
    }
}

function hasData(trEles) {
    var itemSelectEles, itemCheckEles;

    itemSelectEles = trEles.getElementsByClassName("itemSelect");
    itemCheckEles = trEles.getElementsByClassName("itemCheck");

    for (j = 0; j < trEles.childElementCount; j++) {
        trEles.children[j].style.backgroundColor = "";
    }

    for (j = 0; j < itemSelectEles.length; j++) {
        itemEle = itemSelectEles[j];
        if (itemEle.value)
            return true;
    }

    for (j = 0; j < itemCheckEles.length; j++) {
        itemEle = itemCheckEles[j];
        if (itemEle.checked)
            return true;
    }

    return false;
}

window.onbeforeunload = function (e) {

    targetElement = e.target;
console.log('onbeforeunload targetElement.name:' + targetElement.name);


    e.returnValue = "ページから移動しますか？\n入力したデータは保存されません。";
}