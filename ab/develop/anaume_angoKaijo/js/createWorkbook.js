function createWorkbook(d) {
    "use strict";
    var e, workbookEle, sortableEle, questionEles, liEle, tableEle, trEle, tdEle, tdCount, i, il, j, jl;
    workbookEle = document.getElementById("workbookBody");
    if (workbookEle.childElementCount < 1) {
        alert("問題集の内容がありません。\n設問を問題集へ移動してください。");
        return false
    }
    sortableEle = document.getElementById("sortableList");
    e = document.createElement("ul");
    e.id = "sortableList";
    questionEles = workbookEle.children;
    tdCount = questionEles[0].childElementCount;
    for (i = 0, il = questionEles.length; i < il; i += 1) {
        liEle = document.createElement("li");
        liEle.style.listStyleType = "none";
        tableEle = document.createElement("table");
        trEle = document.createElement("tr");
        tdEle = document.createElement("td");
        tdEle.textContent = " ";
        tdEle.className = "questionId";
        tdEle.id = questionEles[i].firstChild.firstChild.value;
        trEle.appendChild(tdEle);
        for (j = 1, jl = tdCount; j < jl; j += 1) {
            tdEle = document.createElement("td");
            if (j === 5 && questionEles[i].childNodes[j].textContent === "") {
                tdEle.textContent = ""
            } else {
                tdEle.textContent = questionEles[i].childNodes[j].textContent
            }
            trEle.appendChild(tdEle)
        }
        tableEle.appendChild(trEle);
        liEle.appendChild(tableEle);
        e.appendChild(liEle)
    }
    sortableEle.parentElement.replaceChild(e, sortableEle);
    $("#sortableList").sortable({
        cursor: "n-resize",
        axis: "y",
        stop: function(a, b) {
            var c, questionEles;
            c = document.getElementById("sortableList");
            questionEles = c.children;
            for (i = 0, il = questionEles.length; i < il; i += 1) {
                questionEles[i].firstChild.firstChild.childNodes[1].textContent = i + 1
            }
        }
    });
    modalOpen("educationEdit")
}