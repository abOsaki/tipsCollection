function checkSend(data) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/check_demand", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(data));
}

function checkComment(e) {
    var targetEle, trEle,
        sendData = {};
    targetEle = e.target;
    tdElement = targetEle.parentElement;
    tdElementChildren = tdElement.children;

    var selectElement;
    var divElement;
    for (var i = 0, len = tdElementChildren.length; i < len; i++) {
    console.log("checkComment() tdElementChildren[" + i + "].nodeName:" + tdElementChildren[i].nodeName);
        if (tdElementChildren[i].nodeName == 'SELECT') {
            selectElement = tdElementChildren[i];
        } else if (tdElementChildren[i].nodeName == 'DIV') {
            divElement = tdElementChildren[i];
        }
    }

    selectvalue = selectElement.value;   // 選択した送信種別
console.log("checkComment() selectvalue:" + selectvalue);
    trEle = targetEle.parentElement.parentElement;
console.log("checkComment() trEle.id:" + trEle.id);
    sendData = {
        id: trEle.id,
        sendtype: selectvalue,
        comment: trEle.getElementsByClassName("commentItem")[0].value
    };
    checkSend(sendData);

    if (selectvalue > 0) {
        if (divElement == undefined) {
            divElement = document.createElement('div');
        }
        divElement.style.color = 'red';
        if (selectvalue == 2) {
            divElement.innerHTML = "全体送信済み";
        } else {
            divElement.innerHTML = "送信済み";
        }
        tdElement.appendChild(divElement);
    }
    trEle.appendChild(tdElement);
}

function checkButton(e) {
    var targetEle, trEle,
        sendData = {};
    targetEle = e.target;
    trEle = targetEle.parentElement.parentElement;
console.log("checkComment() trEle.id:" + trEle.id);
    if (targetEle.value === "1") {
        targetEle.value = 2;
        targetEle.textContent = "既読";
        targetEle.style.color = "black";
        sendData = {
            id: trEle.id,
            check: targetEle.value
        };
    } else if (targetEle.value === "2") {
        targetEle.value = 1;
        targetEle.textContent = "未読";
        targetEle.style.color = "red";
        sendData = {
            id: trEle.id,
            check: targetEle.value
        };
    } else {}
    //alert(JSON.stringify(sendData));
    checkSend(sendData);
}