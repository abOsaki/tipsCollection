function questionInsert() {
    var a, workbookEle, pageDispAreaEle, questionList = [],
        workbookQuesList = [],
        i, j, newTBodyEle, trEle, tdEle, inputEle, overlapFlag;
    a = document.getElementById("questionListBody");
    workbookEle = document.getElementById("workbookBody");
    questionList = a.children;
    overlapFlag = false;
    for (i = 0; i < questionList.length; i++) {
        if (questionList[i].firstChild.firstChild.checked) {
            if (questionExist(questionList[i], workbookEle) == true) {
                overlapFlag = true
            }
            trEle = document.createElement("tr");
            tdEle = document.createElement("td");
            inputEle = document.createElement("input");
            inputEle.type = "checkbox";
            inputEle.name = "questionId";
            inputEle.value = questionList[i].firstChild.firstChild.value;
            tdEle.appendChild(inputEle);
            trEle.appendChild(tdEle);
            tdEle = document.createElement("td");
            tdEle.textContent = workbookEle.childElementCount + 1;
            trEle.appendChild(tdEle);
            for (j = 1; j < 7; j++) {
                tdEle = document.createElement("td");
                tdEle.textContent = questionList[i].childNodes[j].textContent;
                trEle.appendChild(tdEle)
            }
            workbookEle.appendChild(trEle)
        }
    }
    workbookPageCount();
    if (overlapFlag == true) {
        alert("問題の重複があります。")
    }
}

function questionExist(a, b) {
    var c = [],
        i;
    c = b.children;
    for (i = 0; i < c.length; i++) {
        if (a.firstChild.firstChild.value == c[i].firstChild.firstChild.value) {
            return true
        }
    }
    return false
}

function workbookPageCount() {
    var a, pageDispAreaEle, i;
    a = document.getElementById("workbookBody");
    pageDispAreaEle = document.getElementsByClassName("pageDispArea");
    for (i = 0; i < pageDispAreaEle.length; i++) {
        pageDispAreaEle[i].textContent = "ページ総数：" + a.childElementCount
    }
}