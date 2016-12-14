/*
 *  シフト入力情報一覧を取得する。
 */
function getInputWorkShiftList(dateSpan) {
console.log("getInputWorkShiftList start");
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/load_workshift_list", true);
//    xmlhr.responseType = 'text';
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            response = JSON.parse(response);
//            response = xmlhr.response;
            createInputWorkShiftList(response, dateSpan);
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(dateSpan));
}

/*
 * シフト入力情報一覧表示
 */
function createInputWorkShiftList(dataArray, dateSpan) {
    var tHeadEle, tBodyEle, trEle, tdEle, i, j;
//console.log('createInputWorkShiftList dataArray:' + dataArray);

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

    dateT = ["日","月","火","水","木","金","土"];

    tBodyEle = document.getElementById("inputWorkShiftBody");
    tHeadEle = tBodyEle.previousElementSibling;

    var countdata = {}; // 学校の回数

    for ( var i = 0; i < days; i++) {
        var date = new Date(year, month,  i + 1);

        trEle = document.createElement("tr");
        tBodyEle.appendChild(trEle);

        if (date.getDay() == 0) {
          week = '<span style="color: red;">(' + dateT[date.getDay()] + ')</span>';    // 曜日
        } else if (date.getDay() == 6) {
          week = '<span style="color: blue;">(' + dateT[date.getDay()] + ')</span>';    // 曜日
        } else {
          week = '('  + dateT[date.getDay()] + ')';    // 曜日
        }

        tdEle = document.createElement("td");
        tdEle.innerHTML = date.getFullYear() + '/' +  dateZellFill(date.getMonth() + 1) + '/' + dateZellFill(date.getDate()) + ' ' + week;
//        tdEle.style.width = '150px';
        trEle.appendChild(tdEle);

        data = searchWorkshiftData(date, dataArray);
//console.log("createInputWorkShiftList data:" + data);

        if (data) {
            /*************************
             * 終日
             *************************/

            if (data.am_group == data.pm_group &&
                    ((data.am_schoolE != null && data.am_schoolE == data.pm_schoolE) ||
                            (data.am_schoolH != null && data.am_schoolH == data.pm_schoolH))) {

                // 地区
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'all_area';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                if (data.am_group == 1) {
                    setSelectElementItem(selectElement, data.am_areaE, 'area');
                } else if (data.am_group == 2) {
                    setSelectElementItem(selectElement, data.am_areaH, 'area');
                }
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                selectElement.appendChild(optionElement);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                // 学校種別
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'all_group';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                setSelectElementItem(selectElement, data.am_group, 'group');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                // 学校名
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'all_school';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                if (data.am_group == 1) {
                    setSelectElementItem(selectElement, data.am_schoolE, 'schoolE', {'areaid': data.am_areaE});
                } else if (data.am_group == 2) {
                    setSelectElementItem(selectElement, data.am_schoolH, 'schoolH', {'areaid': data.am_areaH});
                }
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);
            } else {
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'all_area';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                setSelectElementItem(selectElement, 0, 'area');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'all_group';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
//                setSelectElementItem(selectElement, 0, 'group');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'all_school';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);
            }
            /*************************
             * AM
             *************************/

            if (data.am_group == data.pm_group &&
                    ((data.am_schoolE != null && data.am_schoolE == data.pm_schoolE) ||
                            (data.am_schoolH != null && data.am_schoolH == data.pm_schoolH))) {

                /*
                 * 終日データの場合はAM枠を空にする。
                 */

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'am_area';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                setSelectElementItem(selectElement, 0, 'area');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'am_group';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
//                setSelectElementItem(selectElement, 0, 'group');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'am_school';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);
            } else {
                // 地区
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'am_area';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                if (data.am_group == 1) {
                    setSelectElementItem(selectElement, data.am_areaE, 'area');
                } else if (data.am_group == 2) {
                    setSelectElementItem(selectElement, data.am_areaH, 'area');
                }
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                selectElement.appendChild(optionElement);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                // 学校種別
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'am_group';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                setSelectElementItem(selectElement, data.am_group, 'group');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                // 学校名
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'am_school';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                if (data.am_group == 1) {
                    setSelectElementItem(selectElement, data.am_schoolE, 'schoolE', {'areaid': data.am_areaE});
                } else if (data.am_group == 2) {
                    setSelectElementItem(selectElement, data.am_schoolH, 'schoolH', {'areaid': data.am_areaH});
                }
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);
            }

            /************************
             * PM
             ************************/

            if (data.am_group == data.pm_group &&
                    ((data.am_schoolE != null && data.am_schoolE == data.pm_schoolE) ||
                            (data.am_schoolH != null && data.am_schoolH == data.pm_schoolH))) {

                /*
                 * 終日データの場合はPM枠を空にする。
                 */

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'pm_area';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                setSelectElementItem(selectElement, 0, 'area');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'pm_group';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
//                setSelectElementItem(selectElement, 0, 'group');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'pm_school';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);
            } else {
                // 地区
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'pm_area';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                if (data.pm_group == 1) {
                    setSelectElementItem(selectElement, data.pm_areaE, 'area');
                } else if (data.pm_group == 2) {
                    setSelectElementItem(selectElement, data.pm_areaH, 'area');
                }
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                // 学校種別
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'pm_group';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                setSelectElementItem(selectElement, data.pm_group, 'group');
                selectElement.addEventListener("change", inputWorkShiftSelect, false);
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);

                // 学校名
                tdEle = document.createElement("td");
                selectElement = document.createElement("select");
                selectElement.className = "itemSelect";
                selectElement.name = 'pm_school';
                optionElement = document.createElement("option");
                optionElement.value = "";
                optionElement.textContent = "--";
                selectElement.appendChild(optionElement);
                if (data.pm_group == 1) {
                    setSelectElementItem(selectElement, data.pm_schoolE, 'schoolE', {'areaid': data.pm_areaE});
                } else if (data.pm_group == 2) {
                    setSelectElementItem(selectElement, data.pm_schoolH, 'schoolH', {'areaid': data.pm_areaH});
                }
                tdEle.appendChild(selectElement);
                trEle.appendChild(tdEle);
            }

            // 休暇
            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            setLeaveSelect(selectElement, 'leave', 'itemSelect', data.leave);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            /*
             * 学校の回数カウント
             */

            // 終日
            if (data.am_group && data.am_group == data.pm_group && ((data.am_schoolE &&data.am_schoolE == data.pm_schoolE) || (data.am_schoolH && data.am_schoolH == data.pm_schoolH))) {
                if (data.am_areaE) {
                    all_area = data.am_areaE;
                } else if (data.am_areaH) {
                    all_area = data.am_areaH;
                }
                if (data.am_schoolE) {
                    all_school = data.am_schoolE;
                } else if (data.am_schoolH) {
                    all_school = data.am_schoolH;
                }
                if (all_area && data.am_group && all_school) {
                    key = all_area + '-' + data.am_group + '-' + all_school;
                    if (countdata[key]) {
                        countdata[key] = countdata[key] + 1;
                    } else {
                        countdata[key] = 1;
                    }
                }
            } else {
                // 午前
                if (data.am_areaE) {
                    am_area = data.am_areaE;
                } else if (data.am_areaH) {
                    am_area = data.am_areaH;
                }
                if (data.am_schoolE) {
                    am_school = data.am_schoolE;
                } else if (data.am_schoolH) {
                    am_school = data.am_schoolH;
                }
                if (am_area && data.am_group && am_school) {
                    key = am_area + '-' + data.am_group + '-' + am_school;
                    if (countdata[key]) {
                        countdata[key] = countdata[key] + 0.5;
                    } else {
                        countdata[key] = 0.5;
                    }
                }

                // 午後
                if (data.pm_areaE) {
                    pm_area = data.pm_areaE;
                } else if (data.pm_areaH) {
                    pm_area = data.pm_areaH;
                }
                if (data.pm_schoolE) {
                    pm_school = data.pm_schoolE;
                } else if (data.pm_schoolH) {
                    pm_school = data.pm_schoolH;
                }
                if (pm_area && data.pm_group && pm_school) {
                    key = pm_area + '-' + data.pm_group + '-' + pm_school;
                    if (countdata[key]) {
                        countdata[key] = countdata[key] + 0.5;
                    } else {
                        countdata[key] = 0.5;
                    }
                }
            }

        } else {
            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'all_area';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            setSelectElementItem(selectElement, 0, 'area');
            selectElement.addEventListener("change", inputWorkShiftSelect, false);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'all_group';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
//            setSelectElementItem(selectElement, 0, 'group');
            selectElement.addEventListener("change", inputWorkShiftSelect, false);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'all_school';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'am_area';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            setSelectElementItem(selectElement, 0, 'area');
            selectElement.addEventListener("change", inputWorkShiftSelect, false);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'am_group';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
//            setSelectElementItem(selectElement, 0, 'group');
            selectElement.addEventListener("change", inputWorkShiftSelect, false);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'am_school';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'pm_area';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            setSelectElementItem(selectElement, 0, 'area');
            selectElement.addEventListener("change", inputWorkShiftSelect, false);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'pm_group';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
//            setSelectElementItem(selectElement, 0, 'group');
            selectElement.addEventListener("change", inputWorkShiftSelect, false);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            selectElement.className = "itemSelect";
            selectElement.name = 'pm_school';
            optionElement = document.createElement("option");
            optionElement.value = "";
            optionElement.textContent = "--";
            selectElement.appendChild(optionElement);
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);

            // 休暇
            tdEle = document.createElement("td");
            selectElement = document.createElement("select");
            setLeaveSelect(selectElement, 'leave', 'itemSelect');
            tdEle.appendChild(selectElement);
            trEle.appendChild(tdEle);
        }
    }

    /*
     * 各学校の回数を表示
     */
    tBodyElementSchoolCount = document.getElementById("schoolCountBody");
    while (tBodyElementSchoolCount.firstChild) {
        tBodyElementSchoolCount.removeChild(tBodyElementSchoolCount.firstChild);
    }

    var cnt = 0;
    var areaname;
    var schoolname;
//console.log("createInputWorkShiftList countdata:" + countdata);
    area_list = get_item_list('area');
    for (key in countdata) {
        cnt++;
//console.log("createInputWorkShiftList key:" + key);
        key_nums = key.split('-');
        area = key_nums[0];
        group = key_nums[1];
        school = key_nums[2];
        value = countdata[key];

//console.log("createInputWorkShiftList area:" + area + " group:" + group + " school:" + school + " value:" + value);

console.log("createInputWorkShiftList area_list:" + area_list);
        if (area_list != undefined) {
            for (i = 0; i < area_list.length; i++) {
//console.log("createInputWorkShiftList area_list[" + i + "].id:" + area_list[i].id);
                if (area_list[i].id == area) {
                    areaname = area_list[i].name;
console.log("createInputWorkShiftList area_list[" + i + "].name:" + areaname);
                    break;
                }
            }
        }

        var school_list;
        if (group == 1) {
//console.log("createInputWorkShiftList() area:" + area);
            school_list = get_item_list('schoolE', {'areaid': area});
        } else if (group == 2) {
//console.log("createInputWorkShiftList() area:" + area);
            school_list = get_item_list('schoolH', {'areaid': area});
        }
//console.log("createInputWorkShiftList school_list:" + school_list);

        if (school_list != undefined) {
            for (i = 0; i < school_list.length; i++) {
//console.log("createInputWorkShiftList school_list[" + i + "].id:" + school_list[i].id);
                if (school_list[i].id == school) {
                    schoolname = school_list[i].name;
//console.log("createInputWorkShiftList school_list[" + i + "].name:" + schoolname);
                    break;
                }
            }
        }

        trElement = document.createElement("tr");

        tdElement = document.createElement("td");
        tdElement.innerHTML = cnt;
        trElement.appendChild(tdElement);

        tdElement = document.createElement("td");
        tdElement.innerHTML = areaname;
        trElement.appendChild(tdElement);

        tdElement = document.createElement("td");
        tdElement.innerHTML = schoolname;
        trElement.appendChild(tdElement);

        tdElement = document.createElement("td");
        tdElement.innerHTML = value;
        trElement.appendChild(tdElement);

        tBodyElementSchoolCount.appendChild(trElement);

    }

}

/*
 * 休暇選択のプルダウンを作成する。
 */
function setLeaveSelect(selectElement, name, className, selected) {
    selectElement.className = className;
    selectElement.name = name;

    optionElement = document.createElement("option");
    optionElement.value = "";
    optionElement.textContent = "--";
    selectElement.appendChild(optionElement);

    optionElement = document.createElement("option");
    optionElement.value = "1";
    optionElement.textContent = "全休";
    if (selected == 1) {
        optionElement.selected = true
    }
    selectElement.appendChild(optionElement);

    optionElement = document.createElement("option");
    optionElement.value = "2";
    optionElement.textContent = "午前半休";
    if (selected == 2) {
        optionElement.selected = true
    }
    selectElement.appendChild(optionElement);

    optionElement = document.createElement("option");
    optionElement.value = "3";
    optionElement.textContent = "午後半休";
    if (selected == 3) {
        optionElement.selected = true
    }
    selectElement.appendChild(optionElement);

    optionElement = document.createElement("option");
    optionElement.value = "4";
    optionElement.textContent = "代休";
    if (selected == 4) {
        optionElement.selected = true
    }
    selectElement.appendChild(optionElement);

    return  selectElement;
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

function inputWorkShiftSelect(e) {
    targetElement = e.target;
//console.log("inputWorkShiftSelect() targetElement:" + targetElement);

    if (targetElement.name === "all_area") {
        trElement = targetElement.parentElement.parentElement;
        rowindex = trElement.rowIndex;

        // 学校種別の選択追加
        selectElements = document.getElementsByName("all_group");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, 'group');

        // 学校の選択追加
        selectElements = document.getElementsByName("all_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);

console.log("inputWorkShiftSelect() targetElement.value:" + targetElement.value);
        if (targetElement.value > 0) {
            selectElements = document.getElementsByName("am_area");
            selectElement = selectElements.item(rowindex);
            selectElement.value = "";
            selectElement.disabled = true;
            selectElements = document.getElementsByName("am_group");
            selectElement = selectElements.item(rowindex);
            selectElement.value = "";
            selectElement.disabled = true;
            selectElements = document.getElementsByName("am_school");
            selectElement = selectElements.item(rowindex);
            selectElement.value = "";
            selectElement.disabled = true;

            selectElements = document.getElementsByName("pm_area");
            selectElement = selectElements.item(rowindex);
            selectElement.value = "";
            selectElement.disabled = true;
            selectElements = document.getElementsByName("pm_group");
            selectElement = selectElements.item(rowindex);
            selectElement.value = "";
            selectElement.disabled = true;
            selectElements = document.getElementsByName("pm_school");
            selectElement = selectElements.item(rowindex);
            selectElement.value = "";
            selectElement.disabled = true;
        } else {
            selectElements = document.getElementsByName("am_area");
            selectElement = selectElements.item(rowindex);
            selectElement.disabled = false;
            selectElements = document.getElementsByName("am_group");
            selectElement = selectElements.item(rowindex);
            selectElement.disabled = false;
            selectElements = document.getElementsByName("am_school");
            selectElement = selectElements.item(rowindex);
            selectElement.disabled = false;

            selectElements = document.getElementsByName("pm_area");
            selectElement = selectElements.item(rowindex);
            selectElement.disabled = false;
            selectElements = document.getElementsByName("pm_group");
            selectElement = selectElements.item(rowindex);
            selectElement.disabled = false;
            selectElements = document.getElementsByName("pm_school");
            selectElement = selectElements.item(rowindex);
            selectElement.disabled = false;
        }

    } else if (targetElement.name === "am_area") {
        trElement = targetElement.parentElement.parentElement;
        rowindex = trElement.rowIndex;

        // 学校種別の選択追加
        selectElements = document.getElementsByName("am_group");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, 'group');

        // 学校の選択追加
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

        // 学校種別の選択追加
        selectElements = document.getElementsByName("pm_group");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, 'group');

        // 学校の選択追加
        selectElements = document.getElementsByName("pm_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);

    } else if (targetElement.name === "all_group") {
        if (targetElement.value == 1) {
            item_name = 'schoolE';
        } else if (targetElement.value == 2) {
            item_name = 'schoolH';
        }
        trElement = targetElement.parentElement.parentElement;
        rowindex = trElement.rowIndex;
        selectAreaElements = document.getElementsByName("all_area");
        selectAreaElement = selectAreaElements.item(rowindex);
        selectElements = document.getElementsByName("all_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, item_name, {'areaid': selectAreaElement.value});

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
        selectElements = document.getElementsByName("am_school");
        selectElement = selectElements.item(rowindex);
        clearOption(selectElement);
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
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
        optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.textContent = "--";
        selectElement.appendChild(optionElement);
        setSelectElementItem(selectElement, 0, item_name, {'areaid': selectAreaElement.value});
    }
}

function inputWorkFrmSubmit() {
    var dispYear = document.getElementById("dispYear");
    var dispMonth = document.getElementById("dispMonth");

    inputWorkShiftData = [];
    inputWorkShiftBodyElement = document.getElementById("inputWorkShiftBody");
    //一行ごとにデータ取得
    for (i = 0; i < inputWorkShiftBodyElement.childElementCount; i++) {
        itemData = {};
        trElements = inputWorkShiftBodyElement.children[i];

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
        inputWorkShiftData.push(itemData);
    }

    window.onbeforeunload = null;

//console.log(inputWorkShiftData);
    saveWorkShift(inputWorkShiftData);
}

/*
 * シフト入力データ保存
 */
function saveWorkShift(data) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/save_workshift", true);
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
