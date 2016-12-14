function saveItemCheck() {
    "use strict";
    var a, checkPoint, checkPointJP, selectError, inputError, i, il;
    checkPoint = ["group", "school", "grade", "curriculum", "unit", "share", "title"];
    checkPointJP = {
        "group": "種別",
        "school": "学校",
        "grade": "学年",
        "curriculum": "教科",
        "unit": "単元",
        "share": "共有範囲",
        "title": "タイトル"
    };
    a = {};
    selectError = "";
    inputError = "";
    for (i = 0, il = checkPoint.length; i < il; i += 1) {
        if (!document.getElementById(checkPoint[i]).value) {
            if (checkPoint[i] === "title") {
                inputError = "「" + checkPointJP[checkPoint[i]] + "」"
            } else {
                selectError += "「" + checkPointJP[checkPoint[i]] + "」"
            }
        }
    }
    a = {
        "select": selectError,
        "input": inputError
    };
    if (a.select || a.input) {
        return a
    } else {
        return true
    }
}

function saveQuestionData() {
    "use strict";
    var a, code, imgName, handle01, handle02, handle03, dblclickEvent, groupEle, schoolEle, gradeEle, curriculumEle, unitEle, shareEle, titleEle, imgItems, imgDataList, imgData, fusenItems, i, il;
    groupEle = document.getElementById("group");
    schoolEle = document.getElementById("school");
    gradeEle = document.getElementById("grade");
    curriculumEle = document.getElementById("curriculum");
    unitEle = document.getElementById("unit");
    shareEle = document.getElementById("share");
    titleEle = document.getElementById("title");
    a = {};
    a.group = groupEle.value;
    if (a.group === "1") {
        code = "E"
    } else if (a.group === "2") {
        code = "H"
    } else {
        code = ""
    }
    a["school" + code] = schoolEle.value;
    a["grade" + code] = gradeEle.value;
    a["curriculum" + code] = curriculumEle.value;
    if (unitType[code] && unitType[code][gradeEle.value] && unitType[code][gradeEle.value][curriculumEle.value]) {
        var unitIndex = "unit" + code + gradeEle.value + unitType[code][gradeEle.value][curriculumEle.value];
        if (code == 'H' && gradeEle.value == 4) {
            unitIndex = "unit" + code + "All" + unitType[code][gradeEle.value][curriculumEle.value]
        }
        a[unitIndex] = unitEle.value
    } else {
        a.unit = 0
    }
    a.title = document.getElementById("title").value;
    a.share = shareEle.value;
    a.textContents = document.getElementById("textContents").innerHTML;
    if (document.getElementById("textContents").className) {
        a.textStyle = document.getElementById("textContents").className
    } else {
        a.textStyle = null
    }
    a.imageContents = ImgOperation.getSaveData();
    a.fusen = fusenOperation.getFusenSaveData();
    a.audioContents = audioOperation.getSaveData();
    a.rubyContents = rubyObjectOperation.getSaveData();
    return a
}

function saveData() {
    "use strict";
    var b, checkItem, code, groupEle, schoolEle, gradeEle, curriculumEle, unitEle, titleEle, saveItemHtml, selEle, pEle, xmlhr;
    checkItem = saveItemCheck();
    groupEle = document.getElementById("group");
    schoolEle = document.getElementById("school");
    gradeEle = document.getElementById("grade");
    curriculumEle = document.getElementById("curriculum");
    unitEle = document.getElementById("unit");
    titleEle = document.getElementById("title");
    if (checkItem === true) {
        b = {};
        b.group = groupEle.value;
        if (b.group === "1") {
            code = "E"
        } else if (b.group === "2") {
            code = "H"
        } else {
            code = ""
        }
        b["grade" + code] = gradeEle.value;
        b["school" + code] = schoolEle.value;
        b["curriculum" + code] = curriculumEle.value;
        if (unitType[code] && unitType[code][gradeEle.value] && unitType[code][gradeEle.value][curriculumEle.value]) {
            var unitIndex = "unit" + code + gradeEle.value + unitType[code][gradeEle.value][curriculumEle.value];
            if (code == 'H' && gradeEle.value == 4) {
                unitIndex = "unit" + code + "All" + unitType[code][gradeEle.value][curriculumEle.value]
            }
            b[unitIndex] = unitEle.value
        } else {
            b.unit = 0
        }
        b.title = document.getElementById("title").value;
        saveItemHtml = document.getElementById("saveText");
        saveItemHtml.innerHTML = "";
        selEle = document.getElementById("group");
        pEle = document.createElement("p");
        pEle.textContent = "種別：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("school");
        pEle = document.createElement("p");
        pEle.textContent = "学校：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("grade");
        pEle = document.createElement("p");
        pEle.textContent = "学年：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("curriculum");
        pEle = document.createElement("p");
        pEle.textContent = "教科：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("unit");
        pEle = document.createElement("p");
        pEle.textContent = "単元：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        pEle = document.createElement("p");
        pEle.textContent = "タイトル：" + b.title;
        saveItemHtml.appendChild(pEle);
        selEle = document.getElementById("share");
        pEle = document.createElement("p");
        pEle.textContent = "共有範囲：" + selEle.options[selEle.selectedIndex].text;
        saveItemHtml.appendChild(pEle);
        document.getElementById("updateText").innerHTML = saveItemHtml.innerHTML;
        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "./php/questionExist.php", true);
        xmlhr.onreadystatechange = function() {
            var a;
            if (xmlhr.readyState === 4) {
                a = xmlhr.responseText;
                if (a === "true") {
                    modalOpen("updateModal")
                } else {
                    modalOpen("insertModal")
                }
            }
        };
        xmlhr.send(JSON.stringify(b))
    } else {
        document.getElementById("alertHozon").innerHTML = "";
        if (checkItem.select) {
            document.getElementById("alertHozon").innerHTML += "<p>" + checkItem.select + "が選択されていません。</p>"
        }
        if (checkItem.input) {
            document.getElementById("alertHozon").innerHTML += "<p>" + checkItem.input + "が入力されていません。</p>"
        }
        modalOpen("alertModal")
    }
}

function saveType(a) {
    "use strict";
    var b, imgFileNames, fileNames, phpUrl, xmlhr, response, i, il;
    b = saveQuestionData();
    if (a === "update") {
        phpUrl = "./php/questionUpdate.php"
    } else {
        phpUrl = "./php/questionSave.php"
    }
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", phpUrl, true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            modalView("saveFin")
        }
    };
    xmlhr.send(JSON.stringify(b));
    imgFileNames = document.getElementsByName("gazou");
    if (imgFileNames) {
        for (i = 0, il = imgFileNames.length; i < il; i += 1) {
            var imgFile = imgFileNames[i];
            imgFileExist(imgFile.alt)
        }
    }
    var audioFiles = document.getElementsByName('audio');
    if (audioFiles) {
        for (i = 0, il = audioFiles.length; i < il; i++) {
            var audioFile = audioFiles[i];
            checkAndInsertAudioFile(audioFile.id)
        }
    }
    fileNames = document.getElementsByClassName("fileLink");
    if (fileNames) {
        for (i = 0, il = fileNames.length; i < il; i += 1) {
            fileExist(fileNames[i].alt)
        }
    }
}