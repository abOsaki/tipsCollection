function questionListOfRadioBBB() {
    var a, quesData, itemEle, groupCode, selectNum, searchWord, date, question, questionList, tBodyEle, newTBodyEle, trEle, tdEle, inputEle, xmlhr, response, i;
    a = ["grade", "school", "curriculum", "unit", "title"];
    quesData = {};
    quesData.group = document.getElementById("group").value;
    if (quesData.group === "1") {
        groupCode = "E"
    } else {
        groupCode = "H"
    }
    for (i = 0; i < a.length; i++) {
        itemEle = document.getElementById(a[i]);
        if (a[i] === "unit") {
            if (document.getElementById("grade").value && document.getElementById("curriculum").value) {
                if (unitType[groupCode] && unitType[groupCode][document.getElementById("grade").value] && unitType[groupCode][document.getElementById("grade").value][document.getElementById("curriculum").value]) {
                    quesData["unit" + groupCode + document.getElementById("grade").value + unitType[groupCode][document.getElementById("grade").value][document.getElementById("curriculum").value]] = document.getElementById("unit").value
                }
            }
        } else if (a[i] === "title") {
            if (document.getElementById(a[i]).value) {
                quesData[a[i]] = document.getElementById(a[i]).value
            }
        } else {
            if (document.getElementById(a[i]).value) {
                selectNum = document.getElementById(a[i]).value;
                quesData[a[i] + groupCode] = selectNum
            }
        }
    }
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/questionSearch.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            questionList = JSON.parse(response);
            tBodyEle = document.getElementById("questionListBody");
            newTBodyEle = document.createElement("tbody");
            newTBodyEle.id = "questionListBody";
            for (i = 0; i < questionList.length; i++) {
                question = JSON.parse(questionList[i]);
                trEle = document.createElement("tr");
                tdEle = document.createElement("td");
                inputEle = document.createElement("input");
                inputEle.type = "radio";
                inputEle.name = "questionId";
                inputEle.value = question.id;
                tdEle.appendChild(inputEle);
                trEle.appendChild(tdEle);
                tdEle = document.createElement("td");
                tdEle.textContent = question.group;
                trEle.appendChild(tdEle);
                tdEle = document.createElement("td");
                if (question.schoolE) {
                    tdEle.textContent = question.schoolE
                } else if (question.schoolH) {
                    tdEle.textContent = question.schoolH
                } else {
                    tdEle.textContent = ""
                }
                trEle.appendChild(tdEle);
                tdEle = document.createElement("td");
                if (question.gradeE) {
                    tdEle.textContent = question.gradeE
                } else if (question.gradeH) {
                    tdEle.textContent = question.gradeH
                } else {
                    tdEle.textContent = ""
                }
                trEle.appendChild(tdEle);
                tdEle = document.createElement("td");
                if (question.curriculumE) {
                    tdEle.textContent = question.curriculumE
                } else if (question.curriculumH) {
                    tdEle.textContent = question.curriculumH
                } else {
                    tdEle.textContent = ""
                }
                trEle.appendChild(tdEle);
                tdEle = document.createElement("td");
                if (question.unit) {
                    tdEle.textContent = question.unit
                } else {
                    tdEle.textContent = "その他"
                }
                trEle.appendChild(tdEle);
                tdEle = document.createElement("td");
                tdEle.textContent = question.title;
                trEle.appendChild(tdEle);
                date = new Date(question.date.replace("-", "/"));
                tdEle = document.createElement("td");
                tdEle.textContent = date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2);
                trEle.appendChild(tdEle);
                date = new Date(question.renewalDate.replace("-", "/"));
                tdEle = document.createElement("td");
                tdEle.textContent = date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2);
                trEle.appendChild(tdEle);
                newTBodyEle.appendChild(trEle)
            }
            tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle)
        }
    };
    xmlhr.send(JSON.stringify(quesData))
}