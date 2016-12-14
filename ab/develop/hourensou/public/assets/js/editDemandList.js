function editDataList(data) {
    var tHeadEle, tBodyEle, trEle, tdEle, i, j;
    //console.log(data);
    tBodyEle = document.getElementById("demandListBody");
    tHeadEle = tBodyEle.previousElementSibling;

//alert('editDataList() data.length:' + data.length);
    for (i = 0; i < data.length; i++) {
        trEle = document.createElement("tr");
        tBodyEle.appendChild(trEle);

//alert('editDataList() JSON.parse(data[' + i + '])["date"]:' + JSON.parse(data[i])["date"]);
//alert('editDataList() data[' + i + ']:' + data[i].date);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["date"];
        tdEle.textContent = data[i].date;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        if (JSON.parse(data[i])["schoolE"]) {
        if (data[i].schoolE) {
//            tdEle.textContent = JSON.parse(data[i])["schoolE"];
            tdEle.textContent = data[i].schoolE;
        } else {
//            tdEle.textContent = JSON.parse(data[i])["schoolH"];
            tdEle.textContent = data[i].schoolH;
        }
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["title"];
        tdEle.textContent = data[i].title;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["trouble"];
        tdEle.textContent = data[i].trouble;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["equipment"];
        tdEle.textContent = data[i].equipment;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["application"];
        tdEle.textContent = data[i].application;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["status"];
        tdEle.textContent = data[i].status;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["souceName"];
        tdEle.textContent = data[i].souceName;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["memo"];
        tdEle.textContent = data[i].memo;
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        if (JSON.parse(data[i])["check"] === "2") {
        if (data[i].check === "2") {
            tdEle.textContent = "済";
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        tdEle = document.createElement("td");
//        tdEle.textContent = JSON.parse(data[i])["comment"];
        if (data[i].sendtype == 2) {
            tdEle.innerHTML = '<div style="color: red;">[全体]</div>' + data[i].comment;
        } else {
            tdEle.textContent = data[i].comment;
        }
        trEle.appendChild(tdEle);
    }
}

function dataList(dateSpan) {
    var xmlhr, response;
//console.log("dataList start");
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/edit/load_demand", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
//alert(response);
            //console.log("resDataList:" + response);
            editDataList(JSON.parse(response));
//            editDataList(response);
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(dateSpan));
}
/*
function loadDataList(e) {
    // 当月1日
    var fDate = new Date();
    fDate.setDate(1);

    // 当月末日
    var eDate = new Date();
    eDate.setDate(1);
    eDate.setMonth(eDate.getMonth() + 1);
    eDate.setDate(eDate.getDate() - 1);

    document.getElementById("dispYear").textContent = fDate.getFullYear();
    document.getElementById("dispMonth").textContent = fDate.getMonth() + 1;

    var dateSpan = {
        "fDate": fDate.getFullYear() + "-" + ('0' + (fDate.getMonth() + 1)).slice(-2) + "-01",
        "eDate": eDate.getFullYear() + "-" + ('0' + (eDate.getMonth() + 1)).slice(-2) + "-" + ('0' + eDate.getDate()).slice(-2)
    };
    //console.log(dateSpan);
    dataList(dateSpan);
}

window.addEventListener("load", loadDataList, false);
*/