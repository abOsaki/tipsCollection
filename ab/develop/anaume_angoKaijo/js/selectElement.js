function removeElement(a) {
    "use strict";
    var b;
    b = a.firstElementChild;
    while (b) {
        a.removeChild(b);
        b = a.firstElementChild
    }
}

function optionEleEdit(a, b, c) {
    "use strict";
    var d, optionEle, optionList, itemList, itemData, i;
    if (!a) {
        return
    }
    if (a.firstElementChild) {
        removeElement(a)
    }
    optionEle = document.createElement("option");
    optionEle.value = "";
    optionEle.textContent = "--";
    a.appendChild(optionEle);
    optionList = SS.getItem(b);
    if (optionList) {
        itemList = JSON.parse(optionList);
        for (i = 0; i < itemList.length; i += 1) {
            itemData = JSON.parse(itemList[i]);
            optionEle = document.createElement("option");
            optionEle.value = itemData.value;
            optionEle.textContent = itemData.name;
            a.appendChild(optionEle)
        }
    }
    if (b === "unit" || !optionList) {
        optionEle = document.createElement("option");
        optionEle.value = 0;
        optionEle.textContent = "その他";
        a.appendChild(optionEle)
    }
    if (parseInt(c, 10)) {
        a.selectedIndex = parseInt(c, 10)
    } else {
        a.selectedIndex = 0
    }
}

function groupSelecter() {
    "use strict";
    var a, schoolCode, selectList, selEle, i, il;
    a = document.getElementById("group");
    if (a.value === "1") {
        schoolCode = "E"
    } else if (a.value === "2") {
        schoolCode = "H"
    } else {
        schoolCode = ""
    }
    selectList = ["school", "grade", "curriculum", "unit"];
    for (i = 0, il = selectList.length; i < il; i += 1) {
        selEle = document.getElementById(selectList[i]);
        optionEleEdit(selEle, selectList[i] + schoolCode, 0)
    }
}

function unitSelecter(pvSelectIndex) {
    "use strict";
    var c, gradeEle, curriculumEle, unitEle, optionEle, code, unitName, xmlhr;
    c = document.getElementById("group");
    gradeEle = document.getElementById("grade");
    curriculumEle = document.getElementById("curriculum");
    unitEle = document.getElementById("unit");
    removeElement(unitEle);
    var gradeNum = parseInt(gradeEle.value, 10);
    var gradeValue = gradeEle.value;
    if (c.value === "1" && gradeNum < 7 && curriculumEle.value) {
        code = "E"
    } else if (c.value === "2" && gradeNum < 5 && curriculumEle.value) {
        if (gradeNum == 4) {
            gradeValue = 'All'
        }
        code = "H"
    } else {
        optionEleEdit(unitEle, "unit", pvSelectIndex);
        return false
    }
    unitName = "unit" + code + gradeValue + unitType[code][gradeEle.value][curriculumEle.value];
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/nameList.php", true);
    xmlhr.onreadystatechange = function() {
        var a, itemData, response, i, il;
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
                if (parseInt(pvSelectIndex, 10)) {
                    unitEle.selectedIndex = parseInt(pvSelectIndex, 10)
                } else {
                    unitEle.selectedIndex = unitEle.childElementCount - 1
                }
            }
            if (unitSelectedCallBack) {
                unitSelectedCallBack()
            }
            loadEnd()
        }
    };
    xmlhr.send(unitName)
}
var unitSelectedCallBack;

function saveUnitSelecter(b) {
    "use strict";
    var c, gradeEle, curriculumEle, unitEle, optionEle, code, unitName, xmlhr;
    c = document.getElementById("saveGroup");
    gradeEle = document.getElementById("saveGrade");
    curriculumEle = document.getElementById("saveCurriculum");
    unitEle = document.getElementById("saveUnit");
    removeElement(unitEle);
    if (c.value === "1" && parseInt(gradeEle.value, 10) < 7 && curriculumEle.value) {
        code = "E"
    } else if (c.value === "2" && parseInt(gradeEle.value, 10) < 4 && curriculumEle.value) {
        code = "H"
    } else {
        optionEleEdit(unitEle, "unit", b);
        return false
    }
    unitName = "unit" + code + gradeEle.value + unitType[code][gradeEle.value][curriculumEle.value];
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/nameList.php", true);
    xmlhr.onreadystatechange = function() {
        var a, itemData, response, i, il;
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
                if (parseInt(b, 10)) {
                    unitEle.selectedIndex = parseInt(b, 10)
                } else {
                    unitEle.selectedIndex = 0
                }
            }
            loadEnd()
        }
    };
    xmlhr.send(unitName)
}