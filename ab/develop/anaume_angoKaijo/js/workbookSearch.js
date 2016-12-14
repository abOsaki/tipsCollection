function workbookRemake(b) {
    var c;
    c = new XMLHttpRequest();
    c.open("POST", "./php/workbook.php", true);
    c.onreadystatechange = function() {
        if (c.readyState === 4) {
            var a, workbookItems, workbookItemsMap, qItem, columnList, response, i, il, j, jl, tableBody, trEle, tdEle, inputEle;
            response = c.responseText;
            if (c.status === 200) {
                workbookItems = JSON.parse(response);
                workbookItemsMap = {};
                for (i = 0, il = workbookItems.length; i < il; i += 1) {
                    qItem = JSON.parse(workbookItems[i]);
                    workbookItemsMap[qItem.id] = qItem
                }
                tableBody = document.getElementById("workbookBody");
                for (i = 0, il = b.length; i < il; i += 1) {
                    a = workbookItemsMap[b[i]];
                    trEle = document.createElement("tr");
                    tdEle = document.createElement("td");
                    inputEle = document.createElement("input");
                    inputEle.name = "questionId";
                    inputEle.type = "checkbox";
                    inputEle.value = a.id;
                    tdEle.appendChild(inputEle);
                    trEle.appendChild(tdEle);
                    tdEle = document.createElement("td");
                    tdEle.textContent = i + 1;
                    trEle.appendChild(tdEle);
                    columnList = ["group", "school", "grade", "curriculum", "unit", "title"];
                    for (j = 0, jl = columnList.length; j < jl; j += 1) {
                        tdEle = document.createElement("td");
                        if (a[columnList[j]]) {
                            tdEle.textContent = a[columnList[j]]
                        } else {
                            tdEle.textContent = ""
                        }
                        trEle.appendChild(tdEle)
                    }
                    tableBody.appendChild(trEle)
                }
                workbookPageCount()
            }
        }
    };
    c.send(JSON.stringify(b))
}

function packageOpen() {
    var a, packageType, educationItem, contentsList, optionEle, code, xmlhr, response, i, il;
    var b = {};
    if (window.location.search) {
        if (1 < window.location.search.length) {
            var c = window.location.search.substring(1);
            var d = c.split('&');
            for (i = 0, il = d.length; i < il; i += 1) {
                var e = d[i].split('=');
                var f = decodeURIComponent(e[0]);
                var g = decodeURIComponent(e[1]);
                b[f] = g
            }
        }
    } else {
        return false
    }
    a = b.eduId;
    packageType = b.eduType;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/educationOpen.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            if (xmlhr.status === 200) {
                educationItem = JSON.parse(response);
                contentsList = educationItem.contents.split(",");
                optionEleEdit(document.getElementById("saveGroup"), "group", educationItem.group);
                if (educationItem.group === "1") {
                    code = "E"
                } else if (educationItem.group === "2") {
                    code = "H"
                } else {
                    code = ""
                }
                optionEleEdit(document.getElementById("saveSchool"), "school" + code, educationItem["school" + code]);
                optionEleEdit(document.getElementById("saveGrade"), "grade" + code, educationItem["grade" + code]);
                optionEleEdit(document.getElementById("saveCurriculum"), "curriculum" + code, educationItem["curriculum" + code]);
                if (unitType[code] && unitType[code][educationItem["grade" + code]] && unitType[code][educationItem["grade" + code]][educationItem["curriculum" + code]]) {
                    saveUnitSelecter(educationItem["unit" + code + educationItem["grade" + code] + unitType[code][educationItem["grade" + code]][educationItem["curriculum" + code]]])
                } else {
                    saveUnitSelecter(1)
                }
                document.getElementById("saveTitle").value = educationItem.title;
                optionEleEdit(document.getElementById("saveShare"), "share", educationItem.share);
                workbookRemake(contentsList)
            }
        }
    };
    xmlhr.send(a)
}

function loadPackage(educationList) {
    var education, columnList, j, jl, bodyName, tBodyEle, newTBodyEle, trEle, tdEle, inputEle;
    var eduType = "package";
    bodyName = "educationListBody";
    tBodyEle = document.getElementById(bodyName);
    newTBodyEle = document.createElement("tbody");
    newTBodyEle.id = bodyName;
    var i, il;
    for (i = 0, il = educationList.length; i < il; i += 1) {
        education = JSON.parse(educationList[i]);
        trEle = document.createElement("tr");
        tdEle = document.createElement("td");
        trEle.className = 'data';
        inputEle = document.createElement("input");
        inputEle.type = "radio";
        inputEle.name = "educationId";
        inputEle.value = "eduType=" + eduType + "&eduId=" + education.id;
        tdEle.appendChild(inputEle);
        trEle.appendChild(tdEle);
        columnList = ["group", "school", "grade", "curriculum", "unit", "title"];
        for (j = 0, jl = columnList.length; j < jl; j += 1) {
            tdEle = document.createElement("td");
            if (education[columnList[j]]) {
                tdEle.textContent = education[columnList[j]]
            } else {
                tdEle.textContent = ""
            }
            trEle.appendChild(tdEle)
        }
        tdEle = document.createElement("td");
        if (education.contents) {
            tdEle.textContent = education.contents.split(",").length + "ページ"
        } else {
            tdEle.textContent = "1ページ"
        }
        trEle.appendChild(tdEle);
        tdEle = document.createElement("td");
        if (education.author) {
            tdEle.textContent = education.author
        } else {
            tdEle.textContent = ""
        }
        trEle.appendChild(tdEle);
        tdEle = document.createElement("td");
        tdEle.textContent = education.share;
        trEle.appendChild(tdEle);
        a = new Date(education.date.replace("-", "/"));
        tdEle = document.createElement("td");
        tdEle.innerHTML = "<p>" + a.getFullYear() + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + ("0" + a.getDate()).slice(-2) + "</p>" + "<p>" + ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2) + ":" + ("0" + a.getSeconds()).slice(-2) + "</p>";
        trEle.appendChild(tdEle);
        a = new Date(education.renewalDate.replace("-", "/"));
        tdEle = document.createElement("td");
        tdEle.innerHTML = "<p>" + a.getFullYear() + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + ("0" + a.getDate()).slice(-2) + "</p>" + "<p>" + ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2) + ":" + ("0" + a.getSeconds()).slice(-2) + "</p>";
        trEle.appendChild(tdEle);
        newTBodyEle.appendChild(trEle)
    }
    tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle)
}

function packageSearch() {
    "use strict";
    var b, searchWordList, itemEle, xmlhr, i, il;
    searchWordList = ["group", "school", "grade", "curriculum", "unit", "title"];
    b = {};
    for (i = 0, il = searchWordList.length; i < il; i += 1) {
        itemEle = document.getElementById(searchWordList[i]);
        if (itemEle.value) {
            b[searchWordList[i]] = itemEle.value
        }
    }
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/workbookSearch.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            var response = xmlhr.responseText;
            var educationList = JSON.parse(response);
            loadPackage(educationList);
            var packageSerchObj = new packageSerchObject(educationList);
            savePackage(packageSerchObj)
        }
    };
    xmlhr.send(JSON.stringify(b))
}

function isPackageSelect() {
    var a, eduType, eduId, i, il;
    a = document.getElementsByName("educationId");
    eduId = "";
    for (i = 0, il = a.length; i < il; i += 1) {
        if (a[i].checked === true) {
            eduId = a[i].value;
            return true
        }
    }
    if (!eduId) {
        alert("問題集を選択してください。");
        return false
    }
}

function packageSelect() {
    var a, eduType, eduId, i, il;
    a = document.getElementsByName("educationId");
    eduId = "";
    for (i = 0, il = a.length; i < il; i += 1) {
        if (a[i].checked === true) {
            eduId = a[i].value;
            break
        }
    }
    if (!eduId) {
        alert("問題集を選択してください。");
        return false
    }
    window.location.href = "./workbook.html?" + eduId
}

function selectLess() {
    var a, eduType, i, il;
    a = document.getElementsByName("educationId");
    for (i = 0, il = a.length; i < il; i += 1) {
        if (a[i].checked === true) {
            a[i].checked = false
        }
    }
}
$(function() {
    $('.tableBody').on("click", ".data", function() {
        var inputs = $(this).find('input');
        if (inputs.length > 0) {
            var input = inputs[0];
            input.checked = true
        }
    })
});