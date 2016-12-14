//「Id名+View」のレイヤーを上にする。
//「送信ボタン」／「月変更ボタン・表示ボタン」切り替え
function editTabChange(e) {
    var targetId, viewId, viewTitle, classEles, images, i;
    targetId = e.id;
console.log('editTabChange() targetId:' + targetId);
    viewId = targetId + "View";
    viewTitle = e.alt;
    classEles = document.getElementsByClassName("reportContent");
    //console.log(targetId,":",viewTitle);
    for (i = 0; i < classEles.length; i++) {
        classEles[i].style.zIndex = 0;
    }

    if (document.getElementById("frmSubmitButton")) {
console.log('document.getElementById("frmSubmitButton")');
        if (targetId === "inputReport" || targetId === "ictReport" || targetId === "demandReport") {
//console.log('tabChange() frmSubmitButton targetId:' + targetId);
            //「送信ボタン」表示／「表示ボタン」非表示
            document.getElementById("frmSubmitButton").style.display = "inline";

            document.getElementById("prevMonthButton").style.display = "none";
            document.getElementById("nextMonthButton").style.display = "none";
            document.getElementById("dispYear").style.display = "none";
            document.getElementById("dispMonth").style.display = "none";
        } else if (targetId === "inputWorkShift") {
console.log('---- inputWorkShift ----');
            document.getElementById("frmSubmitButton").style.display = "inline";
            document.getElementById("prevMonthButton").style.display = "inline";
//            document.getElementById("prevMonthButton").style.top = "8px";
//            document.getElementById("prevMonthButton").style.left = "1090px";
            document.getElementById("nextMonthButton").style.display = "inline";
//            document.getElementById("nextMonthButton").style.top  = "8px";
//            document.getElementById("nextMonthButton").style.left  = "1250px";
            document.getElementById("dispYear").style.display = "inline";
//            document.getElementById("dispYear").style.top = "10px";
//            document.getElementById("dispYear").style.left = "1180px";
            document.getElementById("dispMonth").style.display = "inline";
//            document.getElementById("dispMonth").style.top = "10px";
//            document.getElementById("dispMonth").style.left = "1225px";
        } else {
            //「送信ボタン」非表示／「表示ボタン」表示
            document.getElementById("frmSubmitButton").style.display = "none";

            document.getElementById("prevMonthButton").style.display = "inline";
//            document.getElementById("prevMonthButton").style.top = "8px";
            document.getElementById("nextMonthButton").style.display = "inline";
//            document.getElementById("nextMonthButton").style.top = "8px";
            document.getElementById("dispYear").style.display = "inline";
//            document.getElementById("dispYear").style.top = "10px";
            document.getElementById("dispMonth").style.display = "inline";
//            document.getElementById("dispMonth").style.top = "10px";
        }
    }

    if (document.getElementById("listDateSelecter")) {
        // report
        if (targetId === "reportList" || targetId === "demandList") {
            document.getElementById("listDateSelecter").style.display = "block";
            document.getElementById("analysisSelecter").style.display = "none";
        } else if (targetId === "dataAnalysis") {
            document.getElementById("analysisSelecter").style.display = "block";
            document.getElementById("listDateSelecter").style.display = "none";
        } else {
            document.getElementById("analysisSelecter").style.display = "none";
            document.getElementById("listDateSelecter").style.display = "none";
        }
    }
    //TODO 必要な時にだけ呼び出すように修正
    editSpanChange(0);
}

//「Id名+View」のレイヤーを上にする。
//「送信ボタン」／「月変更ボタン・表示ボタン」切り替え
function reportTabChange(e) {
  var targetId, viewId, viewTitle, classEles, images, i;
  targetId = e.id;
console.log('reportTabChange() targetId:' + targetId);
//alert('targetId:' + targetId);
  viewId = targetId + "View";
  viewTitle = e.alt;
  classEles = document.getElementsByClassName("reportContent");
  //console.log(targetId,":",viewTitle);
  for (i = 0; i < classEles.length; i++) {
      classEles[i].style.zIndex = 0;
  }

  if (targetId === "workShift") {
      document.getElementById("prevMonthButton").style.display = "inline";
      document.getElementById("nextMonthButton").style.display = "inline";
      document.getElementById("dispYear").style.display = "inline";
      document.getElementById("dispMonth").style.display = "inline";
  } else {
      document.getElementById("prevMonthButton").style.display = "none";
      document.getElementById("nextMonthButton").style.display = "none";
      document.getElementById("dispYear").style.display = "none";
      document.getElementById("dispMonth").style.display = "none";
  }

  if (document.getElementById("listDateSelecter")) {
      // report
      if (targetId === "reportList" || targetId === "demandList") {
          document.getElementById("listDateSelecter").style.display = "block";
          document.getElementById("analysisSelecter").style.display = "none";
      } else if (targetId === "dataAnalysis") {
          document.getElementById("analysisSelecter").style.display = "block";
          document.getElementById("listDateSelecter").style.display = "none";
      } else {
          document.getElementById("analysisSelecter").style.display = "none";
          document.getElementById("listDateSelecter").style.display = "none";
      }
  }
  //TODO 必要な時にだけ呼び出すように修正
  reportSpanChange(0);
}
