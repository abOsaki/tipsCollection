function getIctList(date) {
    var xmlhr, response;
  //alert('getIctList() date:' + JSON.stringify(date));
  console.log("getIctList() date:" + date);

      xmlhr = new XMLHttpRequest();
      xmlhr.open("POST", "../api/report/load_list_ict", true);
      xmlhr.onreadystatechange = function () {
          if (xmlhr.readyState === 1) {
              //loading開始処理
              loadStart();
          }
          if (xmlhr.readyState === 4) {
              response = xmlhr.responseText;
              if (response) {
                  ictList(JSON.parse(response));
              }
              //loading終了処理
              loadEnd();
          }
      };
      //console.log(JSON.stringify(date));
      xmlhr.send(JSON.stringify(date));
}

function ictList(dataArray) {
    var tBodyEle, newTBodyEle, trEle, tdEle, pEle, data, i, j;
    tBodyEle = document.getElementById("ictListBody");
    newTBodyEle = document.createElement("tbody");
    newTBodyEle.id = "ictListBody";

    for (i = 0; i < dataArray.length; i++) {
//        data = JSON.parse(dataArray[i]);
        data = dataArray[i];
        trEle = document.createElement("tr");

        //日付
        tdEle = document.createElement("td");
        tdEle.textContent = data["date"];
        trEle.appendChild(tdEle);

        //氏名
        tdEle = document.createElement("td");
        tdEle.textContent = data["user"];
        trEle.appendChild(tdEle);

        //学校
        tdEle = document.createElement("td");
        if (data["schoolE"]) {
            tdEle.textContent = data["schoolE"];
        } else if (data["schoolH"]) {
            tdEle.textContent = data["schoolH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //時間割
        tdEle = document.createElement("td");
        tdEle.textContent = data["lessonTimetable"];
        trEle.appendChild(tdEle);

        //場所
        tdEle = document.createElement("td");
        tdEle.textContent = data["lessonLocation"];
        trEle.appendChild(tdEle);

        //支援有無
        tdEle = document.createElement("td");
        tdEle.textContent = data["support"];
        trEle.appendChild(tdEle);

        //授業支援
        tdEle = document.createElement("td");
        tdEle.textContent = data["lesson"];
        trEle.appendChild(tdEle);

        //学年
        tdEle = document.createElement("td");
        if (data["gradeE"]) {
            tdEle.textContent = data["gradeE"];
        } else if (data["gradeH"]) {
            tdEle.textContent = data["gradeH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //クラス
        tdEle = document.createElement("td");
        if (data["classE"]) {
            tdEle.textContent = data["classE"];
        } else if (data["classH"]) {
            tdEle.textContent = data["classH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //教科
        tdEle = document.createElement("td");
        if (data["curriculumE"]) {
            tdEle.textContent = data["curriculumE"];
        } else if (data["curriculumH"]) {
            tdEle.textContent = data["curriculumH"];
        } else {
            tdEle.textContent = "";
        }
        trEle.appendChild(tdEle);

        //単元
        tdEle = document.createElement("td");
        for (j = 0; j < unitItemList.length; j++) {
            if (data[unitItemList[j]]) {
                tdEle.textContent = data[unitItemList[j]];
            }
        }
        trEle.appendChild(tdEle);

        //目的
        tdEle = document.createElement("td");
        tdEle.textContent = "";
        for (j = 0; j < purposeItemList.length; j++) {
            if (data[purposeItemList[j]]) {
                if (tdEle.textContent) {
                    tdEle.innerHTML += "<br>";
                }
                tdEle.innerHTML += data[purposeItemList[j]];
            }
        }
        trEle.appendChild(tdEle);

        //機器
        tdEle = document.createElement("td");
        tdEle.textContent = "";
        for (j = 0; j < equipmentItemList.length; j++) {
            if (data[equipmentItemList[j]]) {
                if (tdEle.textContent) {
                    tdEle.innerHTML += "<br>";
                }
                tdEle.innerHTML += data[equipmentItemList[j]];
            }
        }
        trEle.appendChild(tdEle);

        //アプリ
        tdEle = document.createElement("td");
        tdEle.textContent = "";
        for (j = 0; j < applicationItemList.length; j++) {
            if (data[applicationItemList[j]]) {
                if (tdEle.textContent) {
                    tdEle.innerHTML += "<br>";
                }
                tdEle.innerHTML += data[applicationItemList[j]];
            }
        }
        trEle.appendChild(tdEle);


        newTBodyEle.appendChild(trEle);
    }
    tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle);
}
