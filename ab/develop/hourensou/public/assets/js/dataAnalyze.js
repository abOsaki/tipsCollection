var chart = [];
//var indexEle;

var indexList = [{
    "name": "業務",
    "key": null
}];
var key;
var dataAry = {};
var values = [];
var labels = [];

var terminalFlag = [];
var outlineTable = [];


function drawChart(drilldown) {
    var graphArea, xmlhr, response, dataList, i;
    var graphEle;
    var legendEle = [];
    legendEle[0] = document.getElementById("reportA_legendArea");
    legendEle[1] = document.getElementById("reportA_legendArea_2");
    var currentOutlineTable;

    legendEle[0].textContent = "業務分析";

    if (drilldown == null) {
        drilldown = 0;
    }

    switch (drilldown) {
    case 0:
        graphArea = "reportA_graphArea";
        graphEle = document.getElementById("reportA_graphArea");
        //        legendEle = document.getElementById("reportA_legendArea");
        outlineTable[0] = document.getElementById("reportA_outline").children[0];
        currentOutlineTable = outlineTable[0];

        indexList = [{
            "name": "業務",
            "key": null
        }];
        dataAry = {};

        document.getElementById("reportA_outline").style.display = "block";
        document.getElementById("reportA_outline_2").style.display = "none";

        break;
    case 1:
        graphArea = "reportA_graphArea_2";
        graphEle = document.getElementById("reportA_graphArea_2");
        //        legendEle = document.getElementById("reportA_legendArea_2");
        outlineTable[1] = document.getElementById("reportA_outline_2").children[0];
        currentOutlineTable = outlineTable[1];
        document.getElementById("reportA_outline_2").style.display = "block";
        break;
        //    indexEle = document.getElementById("reportA_indexArea");
    }

    for (var i = drilldown; i < chart.length; i++) {
        chart[i].destroy();
        //        dataAry[indexList[i].key] = null;
        while (outlineTable[i].hasChildNodes()) {
            outlineTable[i].removeChild(outlineTable[i].firstChild);
        }
    }
    while (indexList.length > drilldown + 1) {
        dataAry[indexList.pop().key] = null;
        //        indexList.pop();
    }

    for (var i = drilldown + 1; i < chart.length; i++) {
        legendEle[i].textContent = "";
    }

    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/load_manage_graph", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;

//alert('response:' + response);
			if (!response) {
				return;
			}
            dataList = JSON.parse(response);

            var property = JSON.parse(dataList[0]);

            //substr バッククオートを外すため
            //            key = JSON.parse(dataList[0]).target.substr(1, JSON.parse(dataList[0]).target.length - 3);
            indexList[indexList.length - 1].key = property.target;

            //終着点フラグを取得
            terminalFlag[drilldown] = property.flag;

            values = null;
            values = [];

            labels[drilldown] = null;
            labels[drilldown] = [];

            var sum = 0;

            for (i = 1; i < dataList.length; i++) {
//                var d = JSON.parse(dataList[i]);
              var d = dataList[i];
                var hourSplit = d.hour.split(".");
                var timeStr = hourSplit[0] + "時間" + (60 * parseFloat("0." + hourSplit[1])) + "分";

                values[i - 1] = d.hour;
                labels[drilldown][i - 1] = d.label;
                sum += parseFloat(d.hour);

                var tr = document.createElement("tr");
                var td;

                td = document.createElement("td");
                td.style.background = color[(i - 1) % color.length];
                td.style.width = "10px";
                tr.appendChild(td);

                td = document.createElement("td");
                td.className = "legendText";
                td.textContent = d.label;
                tr.appendChild(td);

                td = document.createElement("td");
                td.className = "legendText";
                td.textContent = timeStr;
                tr.appendChild(td);

                currentOutlineTable.appendChild(tr);
            } {
                var hourSplit = sum.toString().split(".");
                var timeStr = hourSplit[0] + "時間" + (60 * parseFloat("0." + hourSplit[1])) + "分";

                var tr = document.createElement("tr");
                var td;
                td = document.createElement("td");
                tr.appendChild(td);

                td = document.createElement("td");
                td.textContent = "合計";
                td.setAttribute("class", "goukei");
                tr.appendChild(td);

                td = document.createElement("td");
                td.textContent = timeStr;
                td.setAttribute("class", "goukei");
                tr.appendChild(td);

                currentOutlineTable.appendChild(tr);
            }

            //            drawIndex();

            if (chart[drilldown] == null) {
                chart[drilldown] = pieChart(graphArea, values, labels[drilldown], "");

                graphEle.addEventListener("click", function (event) {
                    //終着点ではないときに有効
                    if (terminalFlag[drilldown] == false) {
                        var activeSegments = chart[drilldown].getSegmentsAtEvent(event);
                        activeSegments.forEach(function (segment) {
                            var num;

                            while (indexList.length > drilldown + 1) {
                                dataAry[indexList.pop().key] = null;

                                //                                indexList.pop();
                            }



                            for (num = 0; num < labels[drilldown].length; num++) {
                                if (segment.label == labels[drilldown][num]) {
                                    var tr = outlineTable[drilldown].children[num];
                                    tr.children[1].style.background = "#FFFF80";
                                    tr.children[2].style.background = "#FFFF80";

                                    legendEle[drilldown + 1].textContent = segment.label;

                                    dataAry[indexList[indexList.length - 1].key] = num + 1;
                                    indexList.push({
                                        "name": segment.label,
                                        "key": null
                                    });
                                    drawChart(drilldown + 1);
                                    //console.log(indexList);
                                } else {
                                    var tr = outlineTable[drilldown].children[num];
                                    tr.children[1].style.background = "none";
                                    tr.children[2].style.background = "none";
                                }
                            }
                        });
                    }
                });
            } else {
                chart[drilldown].destroy();
                chart[drilldown] = pieChart(graphArea, values, labels[drilldown], "");
            }
        }
    };

    dataAry["fDate"] = null;
    dataAry["eDate"] = null;
    dataAry["user"] = null;
    dataAry["group"] = null;
    dataAry["schoolE"] = null;
    dataAry["schoolH"] = null;
    dataAry["gradeE"] = null;
    dataAry["gradeH"] = null;

    // 絞り込み条件をdataAryに詰め込む
    var fYear = document.getElementById("reportA_yearF").value;
    if (fYear != "") {
        var fMonth = document.getElementById("reportA_monthF").value;

        if (fMonth == "") {
            dataAry["fDate"] = fYear + "-01-01";
        } else {
            dataAry["fDate"] = fYear + "-" + ("0" + fMonth).slice(-2) + "-01";
        }
    }

    var eYear = document.getElementById("reportA_yearE").value;
    if (eYear != "") {
        var eMonth = document.getElementById("reportA_monthE").value;

        if (eMonth == "") {
            dataAry["fDate"] = eYear + "-12-31";
        } else {
            var eDate = new Date(eYear, eMonth, 1);
            eDate.setDate(eDate.getDate() - 1);
            dataAry["eDate"] = eDate.getFullYear() + "-" + ("0" + (eDate.getMonth() + 1)).slice(-2) + "-" + eDate.getDate();
        }
    }

    var user = document.getElementById("reportA_user").value;
    if (user != "") {
        dataAry["user"] = user;
    }

    var group = document.getElementById("reportA_group").value;
    if (group != "") {
        dataAry["group"] = group;

        var school = document.getElementById("reportA_school").value;
        if (school != "") {
            if (group == 1) {
                dataAry["schoolE"] = school;
            } else {
                dataAry["schoolH"] = school;
            }
        }

        var grade = document.getElementById("reportA_grade").value;
        if (grade != "") {
            if (group == 1) {
                dataAry["gradeE"] = grade;
            } else {
                dataAry["gradeH"] = grade;
            }
        }
    }

    xmlhr.send(JSON.stringify(dataAry));
}

/*********** ICT分析 ***********/
var ict_chart = null;
var ict_dataAry = {};

function ict_drawChart(drilldown) {

//alert('ict_drawChart');
    var currentOutlineTable = document.getElementById("ictA_outline").children[0];
    var graphArea = "ictA_graphArea";

    document.getElementById("ictA_legendArea").textContent = "ICT活用授業分析";
    document.getElementById("ictA_outline").style.display = "block";

    var xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/load_manage_graph_ict", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 4) {
            var response = xmlhr.responseText;

            var dataList = JSON.parse(response);


//            var prop = JSON.parse(dataList[0]);
          var prop = dataList[0];

            while (currentOutlineTable.hasChildNodes()) {
                currentOutlineTable.removeChild(currentOutlineTable.firstChild);
            }

            var sum = 0;
            var ict_values = [];
            var ict_labels = [];

            for (i = 1; i < dataList.length; i++) {
                var d = JSON.parse(dataList[i]);
                ict_values[i - 1] = d.count;
                ict_labels[i - 1] = d.label;
                sum += parseInt(d.count);

                var tr = document.createElement("tr");
                var td;

                td = document.createElement("td");
                td.style.background = color[(i - 1) % color.length];
                td.style.width = "10px";
                tr.appendChild(td);

                td = document.createElement("td");
                td.className = "legendText";
                td.textContent = d.label;
                tr.appendChild(td);

                td = document.createElement("td");
                td.className = "legendText";
                td.textContent = d.count;
                tr.appendChild(td);

                currentOutlineTable.appendChild(tr);
            } {
                //                var hourSplit = sum.toString().split(".");
                //                var timeStr = hourSplit[0] + "時間" + (60 * parseFloat("0." + hourSplit[1])) + "分";

                var tr = document.createElement("tr");
                var td;
                td = document.createElement("td");
                tr.appendChild(td);

                td = document.createElement("td");
                td.textContent = "合計";
                td.setAttribute("class", "goukei");
                tr.appendChild(td);

                td = document.createElement("td");
                td.textContent = sum;
                td.setAttribute("class", "goukei");
                tr.appendChild(td);

                currentOutlineTable.appendChild(tr);

            }

            if (ict_chart != null) {
                ict_chart.destroy();
            }
            if (prop.group_by == "grade" || prop.group_by == "curriculum") {
                ict_chart = pieChart(graphArea, ict_values, ict_labels, "");
            } else {
                ict_chart = barChart(graphArea, ict_values, ict_labels, "");
            }
        }


    };


    // 絞り込み条件をict_dataAryに詰め込む
    ict_dataAry["fDate"] = null;
    ict_dataAry["eDate"] = null;
    ict_dataAry["group"] = null;
    ict_dataAry["schoolE"] = null;
    ict_dataAry["schoolH"] = null;
    ict_dataAry["gradeE"] = null;
    ict_dataAry["gradeH"] = null;
    ict_dataAry["curriculumE"] = null;
    ict_dataAry["curriculumH"] = null;

    // 絞り込み条件をict_dataAryに詰め込む
    var fYear = document.getElementById("ictA_yearF").value;
    if (fYear != "") {
        var fMonth = document.getElementById("ictA_monthF").value;

        if (fMonth == "") {
            ict_dataAry["fDate"] = fYear + "-01-01";
        } else {
            ict_dataAry["fDate"] = fYear + "-" + ("0" + fMonth).slice(-2) + "-01";
        }
    }

    var eYear = document.getElementById("ictA_yearE").value;
    if (eYear != "") {
        var eMonth = document.getElementById("ictA_monthE").value;

        if (eMonth == "") {
            ict_dataAry["fDate"] = eYear + "-12-31";
        } else {
            var eDate = new Date(eYear, eMonth, 1);
            eDate.setDate(eDate.getDate() - 1);
            ict_dataAry["eDate"] = eDate.getFullYear() + "-" + ("0" + (eDate.getMonth() + 1)).slice(-2) + "-" + eDate.getDate();
        }
    }



    var group = document.getElementById("ictA_group").value;
    if (group != "") {
        ict_dataAry["group"] = group;

        var school = document.getElementById("ictA_school").value;
        if (school != "") {
            if (group == 1) {
                ict_dataAry["schoolE"] = school;
            } else {
                ict_dataAry["schoolH"] = school;
            }
        }

        var grade = document.getElementById("ictA_grade").value;
        if (grade != "") {
            if (group == 1) {
                ict_dataAry["gradeE"] = grade;
            } else {
                ict_dataAry["gradeH"] = grade;
            }
        }

        var curriculum = document.getElementById("ictA_curriculum").value;
        if (curriculum != "") {
            if (group == 1) {
                ict_dataAry["curriculumE"] = curriculum;
            } else {
                ict_dataAry["curriculumH"] = curriculum;
            }
        }
    }



    ict_dataAry["group_by"] = document.getElementById("ictA_group_by").value;

    xmlhr.send(JSON.stringify(ict_dataAry));
}


/*********** トラブル分析 ***********/
var trouble_chart = [];

var trouble_indexList = [{
    "name": "タイトル",
    "key": null
}];
var trouble_dataAry = {};
var trouble_values = [];
var trouble_labels = [];

var trouble_terminalFlag = [];
var trouble_outlineTable = [];

function trouble_drawChart(drilldown) {
    var graphArea, xmlhr, response, dataList, i;
    var graphEle;
    var legendEle = [];
    legendEle[0] = document.getElementById("demandA_legendArea");
    legendEle[1] = document.getElementById("demandA_legendArea_2");
    legendEle[2] = document.getElementById("demandA_legendArea_3");

    var currentOutlineTable;

    legendEle[0].textContent = "トラブル分析";

    if (drilldown == null) {
        drilldown = 0;
    }

    switch (drilldown) {
    case 0:
        graphArea = "demandA_graphArea";
        graphEle = document.getElementById("demandA_graphArea");

        trouble_outlineTable[0] = document.getElementById("demandA_outline").children[0];
        currentOutlineTable = trouble_outlineTable[0];

        trouble_indexList = [{
            "name": "タイトル",
            "key": null
        }];
        trouble_dataAry = {};

        document.getElementById("demandA_outline").style.display = "block";
        document.getElementById("demandA_outline_2").style.display = "none";
        document.getElementById("demandA_outline_3").style.display = "none";

        break;
    case 1:
        graphArea = "demandA_graphArea_2";
        graphEle = document.getElementById("demandA_graphArea_2");

        trouble_outlineTable[1] = document.getElementById("demandA_outline_2").children[0];
        currentOutlineTable = trouble_outlineTable[1];
        document.getElementById("demandA_outline_2").style.display = "block";
        document.getElementById("demandA_outline_3").style.display = "none";
        break;
    case 2:
        graphArea = "demandA_graphArea_3";
        graphEle = document.getElementById("demandA_graphArea_3");

        trouble_outlineTable[2] = document.getElementById("demandA_outline_3").children[0];
        currentOutlineTable = trouble_outlineTable[2];
        document.getElementById("demandA_outline_3").style.display = "block";
        break;
        //    indexEle = document.getElementById("demandA_indexArea");
    }

    for (var i = drilldown; i < trouble_chart.length; i++) {
        trouble_chart[i].destroy();
        //        legendEle[i].textContent = "";
        while (trouble_outlineTable[i].hasChildNodes()) {
            trouble_outlineTable[i].removeChild(trouble_outlineTable[i].firstChild);
        }
    }
    while (trouble_indexList.length > drilldown + 1) {
        trouble_dataAry[trouble_indexList.pop().key] = null;
        //        trouble_indexList.pop();
    }

    for (var i = drilldown + 1; i < trouble_chart.length; i++) {
        legendEle[i].textContent = "";
    }



    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/report/load_manage_graph_trouble", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;

            dataList = JSON.parse(response);

            var property = JSON.parse(dataList[0]);

            //substr バッククオートを外すため
            //            key = JSON.parse(dataList[0]).target.substr(1, JSON.parse(dataList[0]).target.length - 3);
            trouble_indexList[trouble_indexList.length - 1].key = property.target;

            //終着点フラグを取得
            trouble_terminalFlag[drilldown] = property.flag;

            trouble_values = null;
            trouble_values = [];

            trouble_labels[drilldown] = null;
            trouble_labels[drilldown] = [];

            var sum = 0;

            for (i = 1; i < dataList.length; i++) {
                var d = JSON.parse(dataList[i]);

                trouble_values[i - 1] = d.count;
                trouble_labels[drilldown][i - 1] = d.label;
                sum += parseInt(d.count);

                var tr = document.createElement("tr");
                var td;

                td = document.createElement("td");
                td.style.background = color[(i - 1) % color.length];
                td.style.width = "10px";
                tr.appendChild(td);

                td = document.createElement("td");
                td.className = "legendText";
                td.textContent = d.label;
                tr.appendChild(td);

                td = document.createElement("td");
                td.className = "legendText";
                td.textContent = d.count;
                tr.appendChild(td);

                currentOutlineTable.appendChild(tr);
            } {

                var tr = document.createElement("tr");
                var td;
                td = document.createElement("td");
                tr.appendChild(td);

                td = document.createElement("td");
                td.textContent = "合計";
                td.setAttribute("class", "goukei");
                tr.appendChild(td);

                td = document.createElement("td");
                td.textContent = sum;
                td.setAttribute("class", "goukei");
                tr.appendChild(td);

                currentOutlineTable.appendChild(tr);
            }

            if (trouble_chart[drilldown] == null) {
                trouble_chart[drilldown] = pieChart(graphArea, trouble_values, trouble_labels[drilldown], "");

                graphEle.addEventListener("click", function (event) {

                    var activeSegments = trouble_chart[drilldown].getSegmentsAtEvent(event);
                    activeSegments.forEach(function (segment) {
                        var num;


                        for (var i = 0; i < trouble_labels[drilldown].length; i++) {
                            //選択されたセグメントのインデックスiを判定
                            if (segment.label == trouble_labels[drilldown][i]) {
                                //終着点ではないときに有効
                                if (trouble_terminalFlag[drilldown][i] == false) {

                                    while (trouble_indexList.length > drilldown + 1) {
                                        trouble_dataAry[trouble_indexList.pop().key] = null;
                                        //                                trouble_indexList.pop();
                                    }


                                    for (num = 0; num < trouble_labels[drilldown].length; num++) {
                                        if (segment.label == trouble_labels[drilldown][num]) {
                                            var tr = trouble_outlineTable[drilldown].children[num];
                                            tr.children[1].style.background = "#FFFF80";
                                            tr.children[2].style.background = "#FFFF80";

                                            legendEle[drilldown + 1].textContent = segment.label;

                                            trouble_dataAry[trouble_indexList[trouble_indexList.length - 1].key] = num + 1;
                                            trouble_indexList.push({
                                                "name": segment.label,
                                                "key": null
                                            });
                                            trouble_drawChart(drilldown + 1);
                                            //console.log(trouble_indexList);
                                        } else {
                                            var tr = trouble_outlineTable[drilldown].children[num];
                                            tr.children[1].style.background = "none";
                                            tr.children[2].style.background = "none";
                                        }

                                    }
                                }
                                //選択されたセグメントが終着点の場合、何もせず終了
                                break;
                            }
                        }
                    });

                });
            } else {
                trouble_chart[drilldown].destroy();
                trouble_chart[drilldown] = pieChart(graphArea, trouble_values, trouble_labels[drilldown], "");
            }
        }
    };

    trouble_dataAry["fDate"] = null;
    trouble_dataAry["eDate"] = null;
    trouble_dataAry["user"] = null;
    trouble_dataAry["group"] = null;
    trouble_dataAry["schoolE"] = null;
    trouble_dataAry["schoolH"] = null;
    trouble_dataAry["gradeE"] = null;
    trouble_dataAry["gradeH"] = null;

    // 絞り込み条件をtrouble_dataAryに詰め込む
    var fYear = document.getElementById("demandA_yearF").value;
    if (fYear != "") {
        var fMonth = document.getElementById("demandA_monthF").value;

        if (fMonth == "") {
            trouble_dataAry["fDate"] = fYear + "-01-01";
        } else {
            trouble_dataAry["fDate"] = fYear + "-" + ("0" + fMonth).slice(-2) + "-01";
        }
    }

    var eYear = document.getElementById("demandA_yearE").value;
    if (eYear != "") {
        var eMonth = document.getElementById("demandA_monthE").value;

        if (eMonth == "") {
            trouble_dataAry["fDate"] = eYear + "-12-31";
        } else {
            var eDate = new Date(eYear, eMonth, 1);
            eDate.setDate(eDate.getDate() - 1);
            trouble_dataAry["eDate"] = eDate.getFullYear() + "-" + ("0" + (eDate.getMonth() + 1)).slice(-2) + "-" + eDate.getDate();
        }
    }

    var user = document.getElementById("demandA_user").value;
    if (user != "") {
        trouble_dataAry["user"] = user;
    }

    var group = document.getElementById("demandA_group").value;
    if (group != "") {
        trouble_dataAry["group"] = group;

        var school = document.getElementById("demandA_school").value;
        if (school != "") {
            if (group == 1) {
                trouble_dataAry["schoolE"] = school;
            } else {
                trouble_dataAry["schoolH"] = school;
            }
        }

        var grade = document.getElementById("demandA_grade").value;
        if (grade != "") {
            if (group == 1) {
                trouble_dataAry["gradeE"] = grade;
            } else {
                trouble_dataAry["gradeH"] = grade;
            }
        }
    }

    xmlhr.send(JSON.stringify(trouble_dataAry));
}

function analyzeGroupChange(e) {

    var parent = e.target.parentElement;

    var schoolSelecter = parent.getElementsByClassName("analyzeSchool")[0],
        gradeSelecter = parent.getElementsByClassName("analyzeGrade")[0],
        curriculumSelecter = parent.getElementsByClassName("analyzeCurriculum")[0];

    //クリア
    while (schoolSelecter && schoolSelecter.hasChildNodes()) {
        schoolSelecter.removeChild(schoolSelecter.firstChild);
    }
    while (gradeSelecter && gradeSelecter.hasChildNodes()) {
        gradeSelecter.removeChild(gradeSelecter.firstChild);
    }
    while (curriculumSelecter && curriculumSelecter.hasChildNodes()) {
        curriculumSelecter.removeChild(curriculumSelecter.firstChild);
    }


    if (e.target.value != "") {

        var request = {};
        if (schoolSelecter) {
            request["school"] = true;
        }
        if (gradeSelecter) {
            request["grade"] = true;
        }
        if (curriculumSelecter) {
            request["curriculum"] = true;
        }

        if (e.target.value == 1) {
            request["group"] = "E";
        }
        if (e.target.value == 2) {
            request["group"] = "H";
        }

        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "../api/group/get_info", true);
        xmlhr.onreadystatechange = function () {
            if (xmlhr.readyState === 4) {

                var response = JSON.parse(xmlhr.responseText);

//                var req = JSON.parse(response["request"]),
//                    sqls = JSON.parse(response["sqls"]);
              var req = response.request,
                  sqls = response.sqls;

                if (schoolSelecter) {

                    optionEle = document.createElement("option");
                    optionEle.value = "";
                    optionEle.textContent = "--";
                    schoolSelecter.appendChild(optionEle);

//                    var dataList = JSON.parse(response["school"]);
                  var dataList = response.school;

                    for (i = 0; i < dataList.length; i++) {
                        var data = dataList[i];
                        optionEle = document.createElement("option");
                        optionEle.value = data.id;
                        optionEle.textContent = data.name;
                        schoolSelecter.appendChild(optionEle);
                    }

                }
                if (gradeSelecter) {
                    optionEle = document.createElement("option");
                    optionEle.value = "";
                    optionEle.textContent = "--";
                    gradeSelecter.appendChild(optionEle);

                    var dataList = response.grade;

                    for (i = 0; i < dataList.length; i++) {
                        var data = dataList[i];
                        optionEle = document.createElement("option");
                        optionEle.value = data.id;
                        optionEle.textContent = data.name;
                        gradeSelecter.appendChild(optionEle);
                    }

                }
                if (curriculumSelecter) {
                    optionEle = document.createElement("option");
                    optionEle.value = "";
                    optionEle.textContent = "--";
                    curriculumSelecter.appendChild(optionEle);

                    var dataList = response.curriculum;

                    for (i = 0; i < dataList.length; i++) {
                        var data = dataList[i];
                        optionEle = document.createElement("option");
                        optionEle.value = data.id;
                        optionEle.textContent = data.name;
                        curriculumSelecter.appendChild(optionEle);
                    }

                }
            }
        };
        xmlhr.send(JSON.stringify(request));

    }
}

//ユーザーリスト取得
function analyzeReportSelectName(selecterId) {
    var dataList, selectEle, optionEle, i, xmlhr, response;
    if (document.getElementById(selecterId)) {
        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "../api/user/get_list", true);
        xmlhr.onreadystatechange = function () {
            //            if (xmlhr.readyState === 1) {
            //                //loading開始処理
            //                loadStart();
            //            }
            if (xmlhr.readyState === 4) {
                response = xmlhr.responseText;
                dataList = JSON.parse(response);

                selectEle = document.getElementById(selecterId);
                //                selectEle.id = "userNameSelect";
                while (selectEle.hasChildNodes()) {
                    selectEle.removeChild(selectEle.firstChild);
                }

                optionEle = document.createElement("option");
                optionEle.value = "";
                optionEle.textContent = "--";
                selectEle.appendChild(optionEle);
                for (i = 0; i < dataList.length; i++) {
                    optionEle = document.createElement("option");
//                    optionEle.value = JSON.parse(dataList[i]).id;
//                    optionEle.textContent = JSON.parse(dataList[i]).displayName;
                  optionEle.value = dataList[i].id;
                  optionEle.textContent = dataList[i].displayName;
                    selectEle.appendChild(optionEle);
                }
                //                document.getElementById("userNameSelect").parentElement.replaceChild(selectEle, document.getElementById("userNameSelect"));

                //loading終了処理
                //                loadEnd();
            }
        };
        xmlhr.send(null);
    }
}

function analyzeLoad() {
    analyzeReportSelectName("reportA_user");
    analyzeReportSelectName("demandA_user");
}



window.addEventListener("load", analyzeLoad, false);