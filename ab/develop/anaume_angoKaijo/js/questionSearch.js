function loadQuestion(itemDataList) {
    a = "questionListBody";
    tBodyEle = document.getElementById(a);
    newTBodyEle = document.createElement("tbody");
    newTBodyEle.id = a;
    var il;
    for (var i = 0, il = itemDataList.length; i < il; i += 1) {
        itemData = JSON.parse(itemDataList[i]);
        trEle = document.createElement("tr");
        tdEle = document.createElement("td");
        trEle.className = 'data';
        inputEle = document.createElement("input");
        inputEle.type = "radio";
        inputEle.name = "questionId";
        inputEle.value = itemData.id;
        tdEle.appendChild(inputEle);
        trEle.appendChild(tdEle);
        columnList = ["group", "school", "grade", "curriculum", "unit", "title", "author", "share"];
        for (j = 0, jl = columnList.length; j < jl; j += 1) {
            tdEle = document.createElement("td");
            if (itemData[columnList[j]]) {
                tdEle.textContent = itemData[columnList[j]]
            } else {
                tdEle.textContent = ""
            }
            trEle.appendChild(tdEle)
        }
        tdEle = document.createElement("td");
        date = new Date(itemData.date.replace("-", "/"));
        tdEle.innerHTML = "<p>" + date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + "</p>" + "<p>" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "</p>";
        trEle.appendChild(tdEle);
        tdEle = document.createElement("td");
        date = new Date(itemData.renewalDate.replace("-", "/"));
        tdEle.innerHTML = "<p>" + date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + "</p>" + "<p>" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "</p>";
        trEle.appendChild(tdEle);
        newTBodyEle.appendChild(trEle)
    }
    tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle)
}

function questionSearch() {
    "use strict";
    var b, selectList, itemEle, i, il, xmlhr;
    selectList = ["group", "school", "grade", "curriculum", "unit", "title"];
    b = {};
    for (i = 0, il = selectList.length; i < il; i += 1) {
        itemEle = document.getElementById(selectList[i]);
        if (itemEle.value) {
            b[selectList[i]] = itemEle.value
        }
    }
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/questionSearch.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            var a, tBodyEle, newTBodyEle, trEle, tdEle, inputEle, columnList, date, response, itemDataList, itemData, i, il, j, jl;
            response = xmlhr.responseText;
            itemDataList = JSON.parse(response);
            loadQuestion(itemDataList);
            var questionSearchObj = new questionSerchObject(itemDataList);
            saveQuestion(questionSearchObj)
        }
    };
    xmlhr.send(JSON.stringify(b))
}

function anaClickLoad(a) {
    "use strict";
    document.getElementById("textContents").blur();
    if (a.target.tagName === "SPAN") {
        if (a.target.className === "anaaki anaInvisible") {
            a.target.className = "anaaki anaVisible"
        } else {
            a.target.className = "anaaki anaInvisible"
        }
    }
}

function questionOpen() {
    "use strict";
    var b, parameters, eleList, paramKey, paramValue, result, anaEles, code, itemEle, question, imageList, imageItem, imgEle, handleBox01, handleBox02, handleBox03, xmlhr, response, i, il;
    result = {};
    if (window.location.search) {
        if (window.location.search.length > 1) {
            b = window.location.search.substring(1);
            parameters = b.split('&');
            for (i = 0, il = parameters.length; i < il; i += 1) {
                eleList = parameters[i].split('=');
                paramKey = decodeURIComponent(eleList[0]);
                paramValue = decodeURIComponent(eleList[1]);
                result[paramKey] = paramValue
            }
        } else {
            return false
        }
    } else {
        return false
    }
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/questionOpen.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            var a, selectNum, fileName;
            response = xmlhr.responseText;
            question = JSON.parse(response);
            a = "group";
            selectNum = question[a];
            itemEle = document.getElementById(a);
            optionEleEdit(itemEle, a, selectNum);
            itemEle.addEventListener("change", groupSelecter, "false");
            if (question.group === "1") {
                code = "E"
            } else if (question.group === "2") {
                code = "H"
            } else {
                code = null
            }
            a = "school";
            selectNum = question[a + code];
            itemEle = document.getElementById(a);
            optionEleEdit(itemEle, a + code, selectNum);
            a = "grade";
            selectNum = question[a + code];
            itemEle = document.getElementById(a);
            optionEleEdit(itemEle, a + code, selectNum);
            itemEle.addEventListener("change", unitSelecter, "false");
            a = "curriculum";
            selectNum = question[a + code];
            itemEle = document.getElementById(a);
            optionEleEdit(itemEle, a + code, selectNum);
            itemEle.addEventListener("change", unitSelecter, "false");
            if (parseInt(question.unit, 10) > 0) {
                unitSelecter(question.unit)
            } else {
                unitSelecter("noNumber")
            }
            document.getElementById("title").value = question.title;
            a = "share";
            selectNum = question[a];
            itemEle = document.getElementById(a);
            optionEleEdit(itemEle, a, selectNum);
            document.getElementById("author").textContent = question.author;
            document.getElementById("textContents").innerHTML = question.textContents;
            if (question.textStyle) {
                document.getElementById("textContents").className = question.textStyle;
                document.getElementById("questionArea").className = question.textStyle;
                document.getElementById("imageContents").style.direction = "ltr";
                document.getElementById("fusenContents").style.direction = "ltr"
            }
            anaEles = document.getElementById("textContents").getElementsByClassName("anaaki anaInvisible");
            for (i = 0; i < anaEles.length; i += 1) {
                var taishoEles = anaEles[i];
                taishoEles.addEventListener("click", anaClickLoad, false)
            }
            anaEles = document.getElementById("textContents").getElementsByClassName("anaaki anaVisible");
            for (i = 0; i < anaEles.length; i += 1) {
                var taishoElesForVisible = anaEles[i];
                taishoElesForVisible.addEventListener("click", anaClickLoad, false)
            }
            var imgList = JSON.parse(question.imageContents);
            ImgOperation.loadImg(imgList);
            var audioList = JSON.parse(question.audioContents);
            audioOperation.loadAudio(audioList);
            if (question.fusen != null) {
                var fusenList = JSON.parse(question.fusen);
                fusenOperation.loadFusen(fusenList)
            }
            if (question.rubyContents) {
                rubyObjectOperation.loadRuby(question.rubyContents)
            }
        }
    };
    xmlhr.send(JSON.stringify(result.quesid))
}

function isQuestionSelect() {
    var a, id, i;
    a = document.getElementsByName("questionId");
    id = "";
    for (i = 0; i < a.length; i += 1) {
        if (a[i].checked === true) {
            id = a[i].value;
            return true
        }
    }
    if (!id) {
        alert("設問を選択してください。");
        return false
    }
}

function questionSelect() {
    "use strict";
    var a, id, i;
    a = document.getElementsByName("questionId");
    id = "";
    for (i = 0; i < a.length; i += 1) {
        if (a[i].checked === true) {
            id = a[i].value;
            break
        }
    }
    if (!id) {
        alert("設問を選択してください。");
        return false
    }
    window.location.href = "./question.html?quesid=" + id
}

function questionSelectLess() {
    "use strict";
    var a, id, i;
    a = document.getElementsByName("questionId");
    id = "";
    for (i = 0; i < a.length; i += 1) {
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