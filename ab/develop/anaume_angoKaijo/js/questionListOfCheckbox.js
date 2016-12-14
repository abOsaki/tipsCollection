function questionListOfCheckbox() {
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
            var a, question, columnList, response, i, il, j, jl, tBodyEle, newTBodyEle, trEle, tdEle, inputEle;
            response = xmlhr.responseText;
            a = JSON.parse(response);
            tBodyEle = document.getElementById("questionListBody");
            newTBodyEle = document.createElement("tbody");
            newTBodyEle.id = "questionListBody";
            for (i = 0, il = a.length; i < il; i += 1) {
                question = JSON.parse(a[i]);
                trEle = document.createElement("tr");
                tdEle = document.createElement("td");
                inputEle = document.createElement("input");
                inputEle.type = "checkbox";
                inputEle.name = "questionId";
                inputEle.value = question.id;
                tdEle.appendChild(inputEle);
                trEle.appendChild(tdEle);
                columnList = ["group", "school", "grade", "curriculum", "unit", "title"];
                for (j = 0, jl = columnList.length; j < jl; j += 1) {
                    tdEle = document.createElement("td");
                    if (question[columnList[j]]) {
                        tdEle.textContent = question[columnList[j]]
                    } else {
                        tdEle.textContent = ""
                    }
                    trEle.appendChild(tdEle)
                }
                newTBodyEle.appendChild(trEle)
            }
            tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle)
        }
    };
    xmlhr.send(JSON.stringify(b))
}