/*
 *  シフト入力情報一覧を取得する。
 */
function getWorkShiftList(dateSpan, monthForward) {
    var xmlhr, response;
console.log("getWorkShiftList()");

    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/load_workshift_list", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            response = JSON.parse(response);
            createWorkShiftList(response, dateSpan, monthForward);
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(dateSpan));
}

/*
 * シフト入力情報一覧表示
 */
function createWorkShiftList(dataArray, dateSpan, monthForward) {
    var tHeadEle, tBodyEle, trEle, tdEle, i, j;
console.log('createWorkShiftList dataArray:' + dataArray);

    if (dateSpan == null) {
        nowDate = new Date();
        year = nowDate.getFullYear();                      // 年
        month = nowDate.getMonth();                        // 月(0-11)
        var days = new Date(year, month + 1, 0).getDate(); // 日数
    } else {
        fDate = new Date(dateSpan.fDate);
        year = fDate.getFullYear();                      // 年
        month = fDate.getMonth();                        // 月(0-11)
        var days = new Date(year, month + 1, 0).getDate(); // 日数
    }

//console.log('createWorkShiftList monthForward:' + monthForward);
    var dispYear = document.getElementById("dispYear");
    var dispMonth = document.getElementById("dispMonth");

console.log('createWorkShiftList dispYear:' + dispYear + ' dispMonth:' + dispMonth);

    if (dispYear && dispMonth) {
        year = dispYear.textContent;                        // 年
        month = dispMonth.textContent;                      // 月
    } else {
        nowDate = new Date();
        year = nowDate.getYear();                   // 年
        month = nowDate.getMonth() + monthForward + 1;  // 月
    }
    var days = new Date(year, month, 0).getDate(); // 日数
//console.log('createWorkShiftList year:' + year + ' month:' + month + ' days:' + days);

    tBodyEle = document.getElementById("workShiftBody");
    tHeadEle = tBodyEle.previousElementSibling;

    // 初期化
    if (tBodyEle.childElementCount > 0) {
        while (tBodyEle.hasChildNodes()) {
            tBodyEle.removeChild(tBodyEle.firstChild);
        }
    }

    var tmp_areaid;
    var tmp_groupid;
    var tmp_schoolid;
    var tmp_userid;
    var day_count = 0;
//console.log('createWorkShiftList dataArray.length:' + dataArray.length);
    for ( var i = 0; i < dataArray.length; i++) {

        if (tmp_areaid != dataArray[i].areaid ||
            tmp_groupid != dataArray[i].groupid ||
            tmp_schoolid != dataArray[i].schoolid ||
            tmp_userid != dataArray[i].user) {

//console.log('createWorkShiftList tmp_areaid:' + tmp_areaid);
//console.log('createWorkShiftList tmp_groupid:' + tmp_groupid);
//console.log('createWorkShiftList tmp_schoolid:' + tmp_schoolid);
//console.log('createWorkShiftList tmp_userid:' + tmp_userid);

            if (tmp_areaid != null || tmp_groupid != null || tmp_schoolid != null || tmp_userid != null) {
//console.log('2 createWorkShiftList tmp_areaid:' + tmp_areaid);
//console.log('2 createWorkShiftList tmp_groupid:' + tmp_groupid);
//console.log('2 createWorkShiftList tmp_schoolid:' + tmp_schoolid);
//console.log('2 createWorkShiftList tmp_userid:' + tmp_userid);
console.log('2 createWorkShiftList day_count:' + day_count);
console.log('2 createWorkShiftList days:' + days);
                if (day_count < days) {
                    for (var int = day_count; int < days; int++) {
//console.log('2 createWorkShiftList int:' + int);
                        tdEle = document.createElement("td");
                        tdEle.style.width = "30px";
                        trEle.appendChild(tdEle);
                    }
                } else {
                    trEle.appendChild(tdEle);
                }
                day_count = 0;
            }

            trEle = document.createElement("tr");
            tBodyEle.appendChild(trEle);

            tdEle = document.createElement("td");
            tdEle.innerHTML = dataArray[i].areaname;
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            tdEle.innerHTML = dataArray[i].name;
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            tdEle.innerHTML = dataArray[i].username;
            trEle.appendChild(tdEle);
        }

        shiftdate = new Date(dataArray[i].shiftdate);
        date = shiftdate.getDate();
//console.log('createWorkShiftList date:' + date);
//console.log('createWorkShiftList day_count:' + day_count);

        day_count++;

        for (var int = day_count; int < date; int++) {
//console.log('createWorkShiftList int:' + int);
            tdEle = document.createElement("td");
            tdEle.style.width = "30px";
            trEle.appendChild(tdEle);
            day_count++;
        }

        tdEle = document.createElement("td");
        tdEle.style.width = "30px";
        if (date == int) {
//console.log('2 createWorkShiftList date:' + date);
            if (dataArray[i].am_group == dataArray[i].pm_group && dataArray[i].am_schoolid == dataArray[i].pm_schoolid) {
                tdEle.innerHTML = '<span data-toggle="modal" data-target="#staticModal" data-whatever="' + dataArray[i].shiftid + '" style="font-size: 9pt;">終日</span>';
            } else if (dataArray[i].groupid == dataArray[i].am_group && dataArray[i].schoolid == dataArray[i].am_schoolid) {
                tdEle.innerHTML = '<span data-toggle="modal" data-target="#staticModal" data-whatever="' + dataArray[i].shiftid + '">AM</span>';
            } else if (dataArray[i].groupid == dataArray[i].pm_group && dataArray[i].schoolid == dataArray[i].pm_schoolid) {
                tdEle.innerHTML = '<span data-toggle="modal" data-target="#staticModal" data-whatever="' + dataArray[i].shiftid + '">PM</span>';
            } else {
                tdEle.innerHTML = '--';
            }
//console.log(' createWorkShiftList tdEle.innerHTML:' + tdEle.innerHTML);
            trEle.appendChild(tdEle);
        }

        tmp_areaid = dataArray[i].areaid;
        tmp_groupid = dataArray[i].groupid;
        tmp_schoolid = dataArray[i].schoolid;
        tmp_userid = dataArray[i].user;

//        data = searchWorkshiftData(date, dataArray);
//console.log("createWorkShiftList data:" + data);

    }

    if (dataArray.length > 0) {
        if (day_count < days) {
            for (var int = day_count; int < days; int++) {
//console.log('2 createWorkShiftList int:' + int);
                tdEle = document.createElement("td");
                tdEle.style.width = "30px";
                trEle.appendChild(tdEle);
            }
        } else {
            trEle.appendChild(tdEle);
        }
    }
}

function searchWorkshiftData(searchDate, dataArray) {
//console.log("searchWorkshiftData dataArray:" + dataArray);
    sSearchDate = searchDate.getFullYear() + '-' +  dateZellFill(searchDate.getMonth() + 1) + '-' + dateZellFill(searchDate.getDate());
//    for (var i = 0; i < dataArray.length; i++) {
  for (var i in dataArray) {
//console.log('dataArray[i]:' + dataArray[i]);
        if (sSearchDate == dataArray[i].shiftdate) {
            return dataArray[i];
        }
    }
      return null;
}

function workShiftSelect(e) {
    targetElement = e.target;

    if (targetElement.name === "am_area") {
        trElement = targetElement.parentElement.parentElement;
        rowindex = trElement.rowIndex;
        selectElements = document.getElementsByName("am_group");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, 'group');

        selectElements = document.getElementsByName("am_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);

    } else if (targetElement.name === "pm_area") {
        trElement = targetElement.parentElement.parentElement;
        rowindex = trElement.rowIndex;
        selectElements = document.getElementsByName("pm_group");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, 'group');

        selectElements = document.getElementsByName("pm_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
    } else if (targetElement.name === "am_group") {
        if (targetElement.value == 1) {
            item_name = 'schoolE';
        } else if (targetElement.value == 2) {
            item_name = 'schoolH';
        }
        trElement = targetElement.parentElement.parentElement;
        rowindex = trElement.rowIndex;
        selectAreaElements = document.getElementsByName("am_area");
        selectAreaElement = selectAreaElements.item(rowindex);
//console.log("selectAreaElement:" + selectAreaElement);
//console.log("selectAreaElement.name:" + selectAreaElement.name);
//console.log("selectAreaElement.value:" + selectAreaElement.value);
        selectElements = document.getElementsByName("am_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        setSelectElementItem(selectElement, 0, item_name, {'areaid': selectAreaElement.value});
    } else if (targetElement.name === "pm_group") {
        if (targetElement.value == 1) {
            item_name = 'schoolE';
        } else if (targetElement.value == 2) {
            item_name = 'schoolH';
        }
        trElement = targetElement.parentElement.parentElement;
        rowindex = trElement.rowIndex;
        selectAreaElements = document.getElementsByName("pm_area");
        selectAreaElement = selectAreaElements.item(rowindex);
        selectElements = document.getElementsByName("pm_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        setSelectElementItem(selectElement, 0, item_name, {'areaid': selectAreaElement.value});
    }
}

function workFrmSubmit() {
    var dispYear = document.getElementById("dispYear");
    var dispMonth = document.getElementById("dispMonth");

    workShiftData = [];
    workShiftBodyElement = document.getElementById("workShiftBody");
    //一行ごとにデータ取得
    for (i = 0; i < workShiftBodyElement.childElementCount; i++) {
        itemData = {};
        trElements = workShiftBodyElement.children[i];

        if (!hasData(trElements)) {
            continue;
        }

        itemData['shiftdate'] = dispYear.textContent +
                      '-' + dateZellFill(parseInt(dispMonth.textContent)) +
                          '-' + dateZellFill(trElements.rowIndex + 1);
//console.log("itemData['shiftdate']:" + itemData['shiftdate']);

        itemSelectElements = trElements.getElementsByClassName("itemSelect");

        //データが格納されるかフラグ管理
        var validFlag = true;
        for (j = 0; j < itemSelectElements.length; j++) {
            itemElement = itemSelectElements[j];

            if (itemElement.value) {
                itemTitle = itemElement.name;
                itemData[itemTitle] = itemElement.value;
            } else {
                itemTitle = itemElement.name;
                itemData[itemTitle] = 0;
            }
        }
        workShiftData.push(itemData);
    }
//console.log(workShiftData);
    saveWorkShift(workShiftData);
}

/*
 * シフト入力データ保存
 */
function saveWorkShift(data) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/save_workshift", true);
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            location.href = "./";
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(data));
}

function setModalWorkShift(id, target) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/get_workshift", true);
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            response = JSON.parse(response);
//console.log("response[0].username:" + response[0].username);
            $(target).find('.modal-body .username').text(response[0].username);
            $(target).find('.modal-body .shiftdate').text(response[0].shiftdate);

            // シフトID
            inputElement = document.getElementById("workshift_modal_shiftid");
            inputElement.value = id;

            // AM地区
            tdElement = document.getElementById("workshift_modal_am_area_td");
            while (tdElement.firstChild) {
                tdElement.removeChild(tdElement.firstChild);
            }
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'am_area';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            setSelectElementItem(selectElement, response[0].am_areaid, 'area');
            selectElement.addEventListener("change", changeWorkShiftSelect, false);
            selectElement.appendChild(optionElement);
            tdElement.appendChild(selectElement);

            // AM学校種別
            tdElement = document.getElementById("workshift_modal_am_group_td");
            while (tdElement.firstChild) {
                tdElement.removeChild(tdElement.firstChild);
            }
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'am_group';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            setSelectElementItem(selectElement, response[0].am_group, 'group');
            selectElement.addEventListener("change", changeWorkShiftSelect, false);
            tdElement.appendChild(selectElement);

            // AM学校
            tdElement = document.getElementById("workshift_modal_am_school_td");
            while (tdElement.firstChild) {
                tdElement.removeChild(tdElement.firstChild);
            }
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'am_school';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            if (response[0].am_group == 1) {
                setSelectElementItem(selectElement, response[0].am_schoolid, 'schoolE', {'areaid': response[0].am_areaid});
            } else if (response[0].am_group == 2) {
                setSelectElementItem(selectElement, response[0].am_schoolid, 'schoolH', {'areaid': response[0].am_areaid});
            }
            tdElement.appendChild(selectElement);

            // PM地区
            tdElement = document.getElementById("workshift_modal_pm_area_td");
            while (tdElement.firstChild) {
                tdElement.removeChild(tdElement.firstChild);
            }
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'pm_area';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            setSelectElementItem(selectElement, response[0].pm_areaid, 'area');
            selectElement.addEventListener("change", changeWorkShiftSelect, false);
            selectElement.appendChild(optionElement);
            tdElement.appendChild(selectElement);

            // PM学校種別
            tdElement = document.getElementById("workshift_modal_pm_group_td");
            while (tdElement.firstChild) {
                tdElement.removeChild(tdElement.firstChild);
            }
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'pm_group';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            setSelectElementItem(selectElement, response[0].pm_group, 'group');
            selectElement.addEventListener("change", changeWorkShiftSelect, false);
            tdElement.appendChild(selectElement);

            // PM学校
            tdElement = document.getElementById("workshift_modal_pm_school_td");
            while (tdElement.firstChild) {
                tdElement.removeChild(tdElement.firstChild);
            }
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'pm_school';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            if (response[0].pm_group == 1) {
                setSelectElementItem(selectElement, response[0].pm_schoolid, 'schoolE', {'areaid': response[0].pm_areaid});
            } else if (response[0].pm_group == 2) {
                setSelectElementItem(selectElement, response[0].pm_schoolid, 'schoolH', {'areaid': response[0].pm_areaid});
            }
            tdElement.appendChild(selectElement);

            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify({'id': id}));

}

function changeWorkShiftSelect(e) {
    targetElement = e.target;
//console.log("changeWorkShiftSelect() targetElement.name:" + targetElement.name);

    if (targetElement.name === "am_area") {
        trElement = targetElement.parentElement.parentElement;
        selectElements = document.getElementsByName("am_group");
        selectElement = selectElements.item(0);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, 'group');

        selectElements = document.getElementsByName("am_school");
        selectElement = selectElements.item(0);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);

    } else if (targetElement.name === "pm_area") {
        trElement = targetElement.parentElement.parentElement;
        selectElements = document.getElementsByName("pm_group");
        selectElement = selectElements.item(0);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, 'group');

        selectElements = document.getElementsByName("pm_school");
        selectElement = selectElements.item(0);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
    } else if (targetElement.name === "am_group") {
        if (targetElement.value == 1) {
            item_name = 'schoolE';
        } else if (targetElement.value == 2) {
            item_name = 'schoolH';
        }
        trElement = targetElement.parentElement.parentElement;
        selectAreaElements = document.getElementsByName("am_area");
        selectAreaElement = selectAreaElements.item(0);
        selectElements = document.getElementsByName("am_school");
        selectElement = selectElements.item(0);
        clearOption(selectElement);
        setSelectElementItem(selectElement, 0, item_name, {'areaid': selectAreaElement.value});
    } else if (targetElement.name === "pm_group") {
        if (targetElement.value == 1) {
            item_name = 'schoolE';
        } else if (targetElement.value == 2) {
            item_name = 'schoolH';
        }
        trElement = targetElement.parentElement.parentElement;
        selectAreaElements = document.getElementsByName("pm_area");
        selectAreaElement = selectAreaElements.item(0);
        selectElements = document.getElementsByName("pm_school");
        selectElement = selectElements.item(0);
        clearOption(selectElement);
        setSelectElementItem(selectElement, 0, item_name, {'areaid': selectAreaElement.value});
    }
}

function changeWorkFrmSubmit() {

    id = document.getElementById("workshift_modal_shiftid").value;

    itemSelectElements = document.getElementsByClassName("itemSelect");

    workShiftData = [];
    itemData = {};
    for (j = 0; j < itemSelectElements.length; j++) {
        itemElement = itemSelectElements[j];
//console.log('itemElement.name:' + itemElement.name);
//console.log('itemElement.value:' + itemElement.value);

        if (itemElement.value) {
            itemTitle = itemElement.name;
            itemData[itemTitle] = itemElement.value;
        } else {
            itemTitle = itemElement.name;
            itemData[itemTitle] = 0;
        }
    }
//console.log('itemData:' + itemData);

    itemData['id'] = id;
    workShiftData.push(itemData);

//console.log('workShiftData:' + workShiftData);
    saveWorkShift(workShiftData);
}
