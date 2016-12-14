function workbookGroupSelecter() {
    "use strict";
    var a, code, selectEle, groupEle, schoolEle, gradeEle, curriculumEle, unitEle;
    a = ["saveGrade", "saveCurriculum", "saveUnit", "saveSchool"];
    gradeEle = document.getElementById(a[0]);
    curriculumEle = document.getElementById(a[1]);
    unitEle = document.getElementById(a[2]);
    schoolEle = document.getElementById(a[3]);
    groupEle = document.getElementById("saveGroup");
    if (groupEle.value === "1") {
        code = "E"
    } else if (groupEle.value === "2") {
        code = "H"
    } else {
        code = ""
    }
    optionEleEdit(schoolEle, "school" + code, 0);
    optionEleEdit(gradeEle, "grade" + code, 0);
    optionEleEdit(curriculumEle, "curriculum" + code, 0);
    optionEleEdit(unitEle, "", 0)
}

function workbookUnitSelecter(b) {
    "use strict";
    var c, unitFlag, code, unitCode, groupEle, gradeEle, curriculumEle, unitEle, xmlhr, i, il;
    unitFlag = false;
    c = ["saveGroup", "saveGrade", "saveCurriculum"];
    groupEle = document.getElementById(c[0]);
    gradeEle = document.getElementById(c[1]);
    curriculumEle = document.getElementById(c[2]);
    for (i = 0, il = c.length; i < il; i += 1) {
        if (document.getElementById(c[i]).value) {
            unitFlag = true
        } else {
            unitFlag = false;
            return false
        }
    }
    if (unitFlag) {
        if (groupEle.value === "1") {
            code = "E"
        } else if (groupEle.value === "2") {
            code = "H"
        } else {
            code = ""
        }
        if (unitType[code] && unitType[code][gradeEle.value] && unitType[code][gradeEle.value][curriculumEle.value]) {
            unitCode = code + gradeEle.value + unitType[code][gradeEle.value][curriculumEle.value]
        } else {
            unitCode = ""
        }
        unitEle = document.getElementById("saveUnit");
        removeElement(unitEle);
        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "./php/nameList.php", true);
        xmlhr.onreadystatechange = function() {
            var a, itemData, response, optionEle, i, il;
            if (xmlhr.readyState === 1) {
                loadStart()
            }
            if (xmlhr.readyState === 4) {
                response = xmlhr.responseText;
                if (xmlhr.status === 200) {
                    a = JSON.parse(response);
                    optionEle = document.createElement("option");
                    optionEle.value = "";
                    optionEle.textContent = "--";
                    unitEle.appendChild(optionEle);
                    if (a) {
                        for (i = 0, il = a.length; i < il; i += 1) {
                            optionEle = document.createElement("option");
                            itemData = JSON.parse(a[i]);
                            optionEle.value = itemData.value;
                            optionEle.textContent = itemData.name;
                            unitEle.appendChild(optionEle)
                        }
                    }
                    optionEle = document.createElement("option");
                    optionEle.value = "0";
                    optionEle.textContent = "その他";
                    unitEle.appendChild(optionEle);
                    if (parseInt(b, 10) >= 0) {
                        unitEle.value = b;
                        console.log(b)
                    }
                }
                loadEnd()
            }
        };
        xmlhr.send("unit" + unitCode)
    }
}

function workbookSaveInfo() {
    "use strict";
    var b;
    b = new XMLHttpRequest();
    b.open("POST", "./php/loginCheck.php", true);
    b.onreadystatechange = function() {
        var a, response, code, selectName, selectNum, selEle;
        if (b.readyState === 4) {
            response = b.responseText;
            a = JSON.parse(response);
            if (a.group === "1") {
                code = "E"
            } else if (a.group === "2") {
                code = "H"
            } else {
                code = ""
            }
            selectName = "saveGroup";
            selectNum = a.group;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, "group", selectNum);
            selEle.addEventListener("change", workbookGroupSelecter, "false");
            selectName = "saveSchool";
            selectNum = a.school;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, "school" + code, selectNum);
            selectName = "saveGrade";
            selectNum = a.grade;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, "grade" + code, selectNum);
            selEle.addEventListener("change", workbookUnitSelecter, "false");
            selectName = "saveCurriculum";
            selectNum = a.Curriculum;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, "curriculum" + code, selectNum);
            selEle.addEventListener("change", workbookUnitSelecter, "false");
            selectName = "saveUnit";
            selectNum = 0;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, "unit", selectNum);
            selectName = "saveShare";
            selectNum = 1;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, "share", selectNum)
        }
    };
    b.send(null)
}

function workbookPackageList() {
    "use strict";
    var a, questionList, i, il;
    questionList = document.getElementById("questionSortableBody").getElementsByClassName("questionId");
    if (questionList.length) {
        a = [];
        for (i = 0, il = questionList.length; i < il; i += 1) {
            a.push(questionList[i].id)
        }
        return a
    } else {
        return false
    }
}

function workbookSaveData() {
    "use strict";
    var a, code, groupEle, schoolEle, gradeEle, curriculumEle, unitEle, titleEle, shareEle, saveItemHtml, selEle, pEle;
    groupEle = document.getElementById("saveGroup");
    schoolEle = document.getElementById("saveSchool");
    gradeEle = document.getElementById("saveGrade");
    curriculumEle = document.getElementById("saveCurriculum");
    unitEle = document.getElementById("saveUnit");
    titleEle = document.getElementById("saveTitle");
    shareEle = document.getElementById("saveShare");
    a = {};
    if (groupEle.value && schoolEle.value && gradeEle.value && curriculumEle.value && titleEle.value && parseInt(unitEle.value, 10) >= 0) {
        a.group = groupEle.value;
        if (a.group === "1") {
            code = "E"
        } else if (a.group === "2") {
            code = "H"
        }
        a["school" + code] = schoolEle.value;
        a["grade" + code] = gradeEle.value;
        a["curriculum" + code] = curriculumEle.value;
        if (unitType[code] && unitType[code][gradeEle.value] && unitType[code][gradeEle.value][curriculumEle.value]) {
            a["unit" + code + gradeEle.value + unitType[code][gradeEle.value][curriculumEle.value]] = unitEle.value
        } else {
            a.unit = 0
        }
        a.title = titleEle.value;
        a.share = shareEle.value;
        saveItemHtml = document.getElementById("newSaveText");
        saveItemHtml.innerHTML = "";
        selEle = document.getElementById("saveGroup");
        pEle = document.createElement("p");
        pEle.textContent = "種別：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("saveSchool");
        pEle = document.createElement("p");
        pEle.textContent = "学校：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("saveGrade");
        pEle = document.createElement("p");
        pEle.textContent = "学年：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("saveCurriculum");
        pEle = document.createElement("p");
        pEle.textContent = "教科：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("saveUnit");
        pEle = document.createElement("p");
        pEle.textContent = "単元：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        pEle = document.createElement("p");
        pEle.textContent = "タイトル：" + a.title;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("saveShare");
        pEle = document.createElement("p");
        pEle.textContent = "共有設定：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        document.getElementById("upDateText").innerHTML = saveItemHtml.innerHTML;
        return a
    } else {
        return false
    }
}

function workbookNewSave() {
    "use strict";
    var b, saveData, packageSaveData;
    saveData = workbookSaveData();
    packageSaveData = workbookPackageList();
    if (saveData && packageSaveData) {
        saveData.contents = packageSaveData.join(",");
        b = new XMLHttpRequest();
        b.open("POST", "./php/workbookSave.php", true);
        b.onreadystatechange = function() {
            var a;
            if (b.readyState === 4) {
                if (b.status === 200) {
                    a = b.responseText;
                    modalClose()
                }
            }
        };
        b.send(JSON.stringify(saveData))
    } else {
        return false
    }
}

function workbookUpdate(e) {
    "use strict";
    var b, saveData, packageSaveData;
    saveData = workbookSaveData();
    packageSaveData = workbookPackageList();
    if (saveData && packageSaveData) {
        saveData.contents = packageSaveData.join(",");
        b = new XMLHttpRequest();
        b.open("POST", "./php/workbookUpdate.php", true);
        b.onreadystatechange = function() {
            if (b.readyState === 4) {
                if (b.status === 200) {
                    var a;
                    a = b.responseText;
                    modalClose()
                }
            }
        };
        b.send(JSON.stringify(saveData))
    } else {
        return false
    }
}

function saveType() {
    "use strict";
    var b, groupEle, schoolEle, gradeEle, curriculumEle, unitEle, titleEle, shareEle, alertHozonText, xmlhr;
    groupEle = document.getElementById("saveGroup");
    schoolEle = document.getElementById("saveSchool");
    gradeEle = document.getElementById("saveGrade");
    curriculumEle = document.getElementById("saveCurriculum");
    unitEle = document.getElementById("saveUnit");
    titleEle = document.getElementById("saveTitle");
    shareEle = document.getElementById("saveShare");
    b = workbookSaveData();
    if (b) {
        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "./php/workbookExist.php", true);
        xmlhr.onreadystatechange = function() {
            var a;
            if (xmlhr.readyState === 4) {
                if (xmlhr.status === 200) {
                    a = xmlhr.responseText;
                    if (a === "true") {
                        modalView("upDate")
                    } else if (a === "false") {
                        modalView("newSave")
                    } else {
                        console.log("データの取得に失敗しました。")
                    }
                }
            }
        };
        xmlhr.send(JSON.stringify(b))
    } else {
        alertHozonText = document.getElementById("alertText");
        alertHozonText.innerHTML = "";
        if (!groupEle.value) {
            alertHozonText.innerHTML += "「種別」"
        }
        if (!schoolEle.value) {
            alertHozonText.innerHTML += "「学校」"
        }
        if (!gradeEle.value) {
            alertHozonText.innerHTML += "「学年」"
        }
        if (!curriculumEle.value) {
            alertHozonText.innerHTML += "「教科」"
        }
        if (!unitEle.value) {
            alertHozonText.innerHTML += "「単元」"
        }
        if (!shareEle.value) {
            alertHozonText.innerHTML += "「共有設定」"
        }
        if (alertHozonText.innerHTML !== "") {
            alertHozonText.innerHTML = "<p>" + alertHozonText.innerHTML + "が選択されていません。</p>"
        }
        if (!titleEle.value) {
            alertHozonText.innerHTML += "<p>「タイトル」が入力されていません。</p>"
        }
        modalView("alertHozon")
    }
}