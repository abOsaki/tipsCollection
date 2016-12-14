function questionDelete() {
    if (!isQuestionSelect()) {
        return
    }
    var a, btnEles, trEle, xmlhr, response, i, alertItem;
    alertItem = confirm("選択した設問を削除いたします。\nよろしいですか。");
    if (alertItem === true) {
        btnEles = document.getElementsByName("questionId");
        for (i = 0; i < btnEles.length; i++) {
            if (btnEles[i].checked === true) {
                a = btnEles[i].value;
                trEle = btnEles[i].parentElement.parentElement;
                break
            }
        }
        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "./php/questionDelete.php", true);
        xmlhr.onreadystatechange = function() {
            if (xmlhr.readyState === 4 && xmlhr.status === 200) {
                response = xmlhr.responseText;
                if (response === "0") {
                    trEle.parentElement.removeChild(trEle);
                    alert("削除しました。")
                } else if (response === "noAuth") {
                    alert("他の方が作成しているため削除できません。")
                } else {
                    alert("問題集に含まれているため削除できません。")
                }
            }
        };
        xmlhr.send(a)
    }
}

function packageDelete() {
    if (!isPackageSelect()) {
        return
    }
    var a, btnEles, trEle, packId, xmlhr, response, i, alertItem;
    alertItem = confirm("選択した問題集を削除いたします。\nよろしいですか。");
    if (alertItem === true) {
        btnEles = document.getElementsByName("educationId");
        for (i = 0; i < btnEles.length; i++) {
            if (btnEles[i].checked === true) {
                a = btnEles[i].value;
                trEle = btnEles[i].parentElement.parentElement;
                break
            }
        }
        packId = a.match(/eduId=(.+)/)[1];
        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "./php/packageDelete.php", true);
        xmlhr.onreadystatechange = function() {
            if (xmlhr.readyState === 4 && xmlhr.status === 200) {
                response = xmlhr.responseText;
                if (response === "noAuth") {
                    alert("他の方が作成しているため削除できません。")
                } else {
                    trEle.parentElement.removeChild(trEle);
                    alert("削除しました。")
                }
            }
        };
        xmlhr.send(packId)
    }
}