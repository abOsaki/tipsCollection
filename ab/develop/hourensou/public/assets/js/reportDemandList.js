function getDemandList(date) {
    var xmlhr, response;
  //alert('getDemandList() date:' + JSON.stringify(date));
  console.log("getIctList() date:" + date);

      xmlhr = new XMLHttpRequest();
      xmlhr.open("POST", "../api/report/load_list_demand", true);
      xmlhr.onreadystatechange = function () {
          if (xmlhr.readyState === 1) {
              //loading開始処理
              loadStart();
          }
          if (xmlhr.readyState === 4) {
              response = xmlhr.responseText;
              if (response) {
                  demandList(JSON.parse(response));
              }
              //loading終了処理
              loadEnd();
          }
      };
      //console.log(JSON.stringify(date));
      xmlhr.send(JSON.stringify(date));
}

function demandList(dataArray) {
    var tBodyEle, newTBodyEle, trEle, tdEle, buttonEle, textareaEle, imgEle, data, i;
    tBodyEle = document.getElementById("demandListBody");
    newTBodyEle = document.createElement("tbody");
    newTBodyEle.id = "demandListBody";

    for (i = 0; i < dataArray.length; i++) {
//        data = JSON.parse(dataArray[i]);
        data = dataArray[i];
        trEle = document.createElement("tr");
        //内容ID
        trEle.id = data["id"];

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

        //タイトル
        tdEle = document.createElement("td");
        tdEle.textContent = data["title"];
        trEle.appendChild(tdEle);

        //トラブル
        tdEle = document.createElement("td");
        tdEle.textContent = data["trouble"];
        trEle.appendChild(tdEle);

        //機器・アプリケーション
        tdEle = document.createElement("td");
        tdEle.textContent = "";
        if (data["equipment"]) {
            tdEle.textContent += data["equipment"]
        };
        if (data["application"]) {
            tdEle.textContent += data["application"]
        };
        trEle.appendChild(tdEle);

        //状況
        tdEle = document.createElement("td");
        tdEle.textContent = data["status"];
        trEle.appendChild(tdEle);

        //情報元
        tdEle = document.createElement("td");
        tdEle.textContent = data["souceName"];
        trEle.appendChild(tdEle);

        //メモ
        tdEle = document.createElement("td");
        tdEle.textContent = data["memo"];
        trEle.appendChild(tdEle);

        //チェック
        tdEle = document.createElement("td");
        buttonEle = document.createElement("button");
        buttonEle.className = "checkButton";
        if (data["check"] === "未読") {
            buttonEle.type = "button";
            buttonEle.value = 1;
            buttonEle.textContent = data["check"];
            buttonEle.style.color = "red";
            buttonEle.addEventListener("click", checkButton, false);
            tdEle.appendChild(buttonEle);
        } else if (data["check"]　 === "既読") {
            buttonEle.type = "button";
            buttonEle.value = 2;
            buttonEle.textContent = data["check"];
            buttonEle.style.color = "black";
            buttonEle.addEventListener("click", checkButton, false);
            tdEle.appendChild(buttonEle);
        } else {
            buttonEle.type = "button";
            buttonEle.value = 1;
            buttonEle.textContent = "未読";
            buttonEle.style.color = "red";
            buttonEle.addEventListener("click", checkButton, false);
            tdEle.appendChild(buttonEle);
        }
        trEle.appendChild(tdEle);

        //コメント
        tdEle = document.createElement("td");
        textareaEle = document.createElement("textarea");
        textareaEle.className = "commentItem";
        if (data["comment"]) {
            textareaEle.value = data["comment"];
        } else {
            textareaEle.value = "";
        }
        tdEle.appendChild(textareaEle);
        trEle.appendChild(tdEle);

        //送信ボタン
        tdEle = document.createElement("td");
/*
        imgEle = document.createElement("img");
        imgEle.src = "./images/b2_03_off.png";
        imgEle.className = "submitImg";
        imgEle.addEventListener("click", checkComment, false);
        tdEle.appendChild(imgEle);
*/
        selectElement = document.createElement("select");
        selectElement.name = 'sendtype';
        optionElement = document.createElement("option");
        optionElement.value = "1";
        optionElement.textContent = "個人";
        selectElement.appendChild(optionElement);
        optionElement = document.createElement("option");
        optionElement.value = "2";
        optionElement.textContent = "全体";
        selectElement.appendChild(optionElement);
        tdEle.appendChild(selectElement);

        buttonElement = document.createElement("button");
        buttonElement.className = 'btn btn-primary btn-sm';
        buttonElement.innerHTML = '送信';
        buttonElement.addEventListener("click", checkComment, false);
        tdEle.appendChild(buttonElement);
        if (data["sendtype"] > 0) {
            var element = document.createElement('div');
            element.style.color = 'red';
            if (data["sendtype"] == 2) {
                element.innerHTML = "全体送信済み";
            } else {
                element.innerHTML = "送信済み";
            }
            tdEle.appendChild(element);
        }
        trEle.appendChild(tdEle);

        newTBodyEle.appendChild(trEle);
    }
    tBodyEle.parentElement.replaceChild(newTBodyEle, tBodyEle);
    smartRollover();
}
