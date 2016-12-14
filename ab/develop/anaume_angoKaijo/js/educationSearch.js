function loadEdcation(educationList, eduType) {
    var a, columnList, educationList, education, bodyName, response, i, il, j, jl, tBodyEle, newTBodyEle, trEle, tdEle, inputEle;
    bodyName = "educationListBody";
    tBodyEle = document.getElementById(bodyName);
    newTBodyEle = document.createElement("tbody");
    newTBodyEle.id = bodyName;
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
        columnList = ["group", "school", "grade", "curriculum", "unit", "title", "author"];
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

function educationSearch() {
    "use strict";
    var b, selectList, eduType, itemEle, i, il, xmlhr;
    selectList = ["group", "school", "grade", "curriculum", "unit", "title"];
    b = {};
    for (i = 0, il = selectList.length; i < il; i += 1) {
        itemEle = document.getElementById(selectList[i]);
        if (itemEle.value) {
            b[selectList[i]] = itemEle.value
        }
    }
    xmlhr = new XMLHttpRequest();
    if (document.getElementById("ques").checked === true) {
        eduType = document.getElementById("ques").value;
        xmlhr.open("POST", "./php/questionSearch.php", true)
    } else {
        eduType = document.getElementById("pack").value;
        xmlhr.open("POST", "./php/educationSearch.php", true)
    }
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            var response = xmlhr.responseText;
            var educationList = JSON.parse(response);
            loadEdcation(educationList, eduType);
            var educationObj = new educationSerchObject(educationList);
            educationObj.eduType = eduType;
            saveEducation(educationObj)
        }
    };
    xmlhr.send(JSON.stringify(b))
}

function educationSelect() {
    "use strict";
    var a, eduType, eduId, i;
    a = document.getElementsByName("educationId");
    eduId = "";
    for (i = 0; i < a.length; i += 1) {
        if (a[i].checked === true) {
            eduId = a[i].value;
            break
        }
    }
    if (!eduId) {
        alert("教材を選択してください。");
        return false
    }
    window.location.href = "./education.html?" + eduId
}

function educationSelectLess() {
    "use strict";
    var a, i;
    a = document.getElementsByName("educationId");
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