function editSpanChange(monthForward) {
//console.log('editSpanChange() monthForward:' + monthForward);
    //edit
    var dispYear = document.getElementById("dispYear");
    var dispMonth = document.getElementById("dispMonth");
    //report
    var dateFromYear = document.getElementById("yearDateFrom");
    var dateFromMonth = document.getElementById("monthDateFrom");
    var dateToYear = document.getElementById("yearDateTo");
    var dateToMonth = document.getElementById("monthDateTo");

    //edit,report判断フラグ
    var listFlag = false;

    if (dispYear && dispMonth) {
        var fDate = new Date(parseInt(dispYear.textContent), parseInt(dispMonth.textContent) - 1 + monthForward, 1);
        var eDate = new Date(fDate.getFullYear(), fDate.getMonth() + 1, 1);
        eDate.setDate(eDate.getDate() - 1);

        dispYear.textContent = fDate.getFullYear();
        dispMonth.textContent = fDate.getMonth() + 1;
        listFlag = true;
    } else if (dateFromYear && dateToYear) {
        var fDate = new Date(parseInt(dateFromYear.value), parseInt(dateFromMonth.value) - 1, 1);
        var eDate = new Date(parseInt(dateToYear.value), parseInt(dateToMonth.value), 1);
        eDate.setDate(eDate.getDate() - 1);
    }

    var dateSpan = {
        "fDate": fDate.getFullYear() + "-" + ('0' + (fDate.getMonth() + 1)).slice(-2) + "-01",
        "eDate": eDate.getFullYear() + "-" + ('0' + (eDate.getMonth() + 1)).slice(-2) + "-" + ('0' + eDate.getDate()).slice(-2)
    };

    var tableRows;
    if (document.getElementById("inputWorkShiftView")) {
        if (document.getElementById("inputWorkShiftView").classList.contains("active")) {
           // シフト入力タブ
            tableRows = document.getElementById("inputWorkShiftBody");
            if (tableRows.childElementCount > 0 && listFlag) {
                while (tableRows.hasChildNodes()) {
                    tableRows.removeChild(tableRows.firstChild);
                }
            } else if (tableRows.childElementCount == 0 && !listFlag) {
                dateSpan.tableName = "inputWorkShiftList";
                getInputWorkShiftList(dateSpan);
            }
            if (listFlag) {
            	getInputWorkShiftList(dateSpan);
            }

            return;
        }
    }

//console.log('editSpanChange() document.getElementById("workShiftView"):' + document.getElementById("workShiftView"));
    if (document.getElementById("workShiftView")) {
        if (document.getElementById("workShiftView").classList.contains("active")) {
            var tr = document.createElement( 'tr' );

            var th = document.createElement( 'th' );
            th.setAttribute("rowSpan", "2");
            th.innerHTML = "地区▼";
            th.setAttribute("onclick", "filter('area')");
            tr.appendChild(th);
            var th = document.createElement( 'th' );
            th.setAttribute("rowSpan", "2");
            th.innerHTML = "学校名▼";
            th.setAttribute("onclick", "filter('school')");
            tr.appendChild(th);
            var th = document.createElement( 'th' );
            th.setAttribute("rowSpan", "2");
            th.innerHTML = "担当▼";
            th.setAttribute("onclick", "filter('user')");
            tr.appendChild(th);

            nowDate = new Date();
            year = nowDate.getYear();             // 年
            month = nowDate.getMonth() + 1; // 月
            var days = new Date(year, month, 0).getDate(); // 日数
            dateT = ["日","月","火","水","木","金","土"];

            var reportTheadObj = document.getElementById("reportThead");
            for (var i =reportTheadObj.childNodes.length-1; i>=0; i--) {
                reportTheadObj.removeChild(reportTheadObj.childNodes[i]);
             }

            for ( var i = 0; i < days; i++) {
                var date = new Date(year, month,  i + 1);
                var th = document.createElement( 'th' );
                if (date.getDay() == 0) {
                    th.innerHTML = '<div style="color: red;">' + (i + 1) + '</div>';
                } else if (date.getDay() == 6) {
                    th.innerHTML = '<div style="color: blue;">' + (i + 1) + '</div>';
                } else {
                    th.innerHTML = i + 1;
                }
                th.style.width = "30px";
                tr.appendChild(th);
            }
            reportTheadObj.appendChild(tr);

            var tr = document.createElement( 'tr' );
            for ( var i = 0; i < days; i++) {
                var date = new Date(year, month,  i + 1);
                var th = document.createElement( 'th' );
                if (date.getDay() == 0) {
                    th.innerHTML = '<div style="color: red;">' + dateT[date.getDay()] + '</div>';    // 曜日
                } else if (date.getDay() == 6) {
                    th.innerHTML = '<div style="color: blue;">' + dateT[date.getDay()] + '</div>';    // 曜日
                } else {
                    th.innerHTML = dateT[date.getDay()];    // 曜日
                }
                th.style.width = "30px";
                tr.appendChild(th);
            }
            reportTheadObj.appendChild(tr);

            // シフト入力タブ
            tableRows = document.getElementById("workShiftBody");
//console.log('editSpanChange() tableRows.childElementCount:' + tableRows.childElementCount);
//console.log('editSpanChange() listFlag:' + listFlag);
            if (tableRows.childElementCount > 0 && listFlag) {
                while (tableRows.hasChildNodes()) {
                    tableRows.removeChild(tableRows.firstChild);
                }
            } else if (tableRows.childElementCount == 0 && !listFlag) {
                dateSpan.tableName = "workShift";
//console.log('editSpanChange() 1 getWorkShiftList');
                getWorkShiftList(dateSpan, monthForward);
            }
            if (listFlag) {
//console.log('editSpanChange() 2 getWorkShiftList');
                getWorkShiftList(dateSpan, monthForward);
            }

            return;
        }
    }

    if (document.getElementById("reportListView").classList.contains("active")) {
        //業務報告一覧タブ
        tableRows = document.getElementById("reportListBody");
        if (tableRows.childElementCount > 0 && listFlag) {
            while (tableRows.hasChildNodes()) {
                tableRows.removeChild(tableRows.firstChild);
            }
        } else if (tableRows.childElementCount == 0 && !listFlag) {
            dateSpan.tableName = "reportList";
            getManageList(dateSpan);
        }
        if (listFlag) {
            getReportList(dateSpan);
        }
    } else if (document.getElementById("ictListView").classList.contains("active")) {
//console.log('editSpanChange() ictListView');
        //ICT活用授業報告一覧
        tableRows = document.getElementById("ictListBody");
        if (tableRows.childElementCount > 0 && listFlag) {
            while (tableRows.hasChildNodes()) {
                tableRows.removeChild(tableRows.firstChild);
            }
        } else if (tableRows.childElementCount == 0 && !listFlag) {
            dateSpan.tableName = "ictList";
//            getIctList(dateSpan);
            getManageList(dateSpan);
        }
//console.log('editSpanChange() listFlag:' + listFlag);
        if (listFlag) {
            getIctReportList(dateSpan);
        }
    } else if (document.getElementById("demandListView").classList.contains("active")) {
        //要望・トラブル等報告一覧
        tableRows = document.getElementById("demandListBody");
        if (tableRows.childElementCount > 0 && listFlag) {
            while (tableRows.hasChildNodes()) {
                tableRows.removeChild(tableRows.firstChild);
            }
        } else if (tableRows.childElementCount == 0 && !listFlag) {
            dateSpan.tableName = "demandList";
            getManageList(dateSpan);
        }
//console.log('editSpanChange() listFlag' + listFlag);
        if (listFlag) {
//console.log('editSpanChange() dataList');
            dataList(dateSpan);
        }
    }
}

function reportSpanChange(monthForward) {
    console.log('reportSpanChange() monthForward:' + monthForward);
        //edit
        var dispYear = document.getElementById("dispYear");
        var dispMonth = document.getElementById("dispMonth");
        //report
        var dateFromYear = document.getElementById("yearDateFrom");
        var dateFromMonth = document.getElementById("monthDateFrom");
        var dateToYear = document.getElementById("yearDateTo");
        var dateToMonth = document.getElementById("monthDateTo");

        //edit,report判断フラグ
        var listFlag = false;

        if (dispYear && dispMonth) {
            var fDate = new Date(parseInt(dispYear.textContent), parseInt(dispMonth.textContent) - 1 + monthForward, 1);
            var eDate = new Date(fDate.getFullYear(), fDate.getMonth() + 1, 1);
            eDate.setDate(eDate.getDate() - 1);

            dispYear.textContent = fDate.getFullYear();
            dispMonth.textContent = fDate.getMonth() + 1;
            listFlag = true;
        } else if (dateFromYear && dateToYear) {
            var fDate = new Date(parseInt(dateFromYear.value), parseInt(dateFromMonth.value) - 1, 1);
            var eDate = new Date(parseInt(dateToYear.value), parseInt(dateToMonth.value), 1);
            eDate.setDate(eDate.getDate() - 1);
        }

        var dateSpan = {
            "fDate": fDate.getFullYear() + "-" + ('0' + (fDate.getMonth() + 1)).slice(-2) + "-01",
            "eDate": eDate.getFullYear() + "-" + ('0' + (eDate.getMonth() + 1)).slice(-2) + "-" + ('0' + eDate.getDate()).slice(-2)
        };

        var tableRows;
        if (document.getElementById("inputWorkShiftView")) {
        if (document.getElementById("inputWorkShiftView").classList.contains("active")) {
           // シフト入力タブ
            tableRows = document.getElementById("inputWorkShiftBody");
            if (tableRows.childElementCount > 0 && listFlag) {
                while (tableRows.hasChildNodes()) {
                    tableRows.removeChild(tableRows.firstChild);
                }
            } else if (tableRows.childElementCount == 0 && !listFlag) {
                dateSpan.tableName = "inputWorkShiftList";
                getInputWorkShiftList(dateSpan);
            }
            if (listFlag) {
                getInputWorkShiftList(dateSpan);
            }

            return;
        }
        }

//console.log('reportSpanChange() document.getElementById("workShiftView"):' + document.getElementById("workShiftView"));
        if (document.getElementById("workShiftView")) {
            if (document.getElementById("workShiftView").classList.contains("active")) {
                var tr = document.createElement( 'tr' );

                var th = document.createElement( 'th' );
                th.setAttribute("rowSpan", "2");
                th.innerHTML = "地区▼";
                th.setAttribute("onclick", "filter('area')");
                tr.appendChild(th);
                var th = document.createElement( 'th' );
                th.setAttribute("rowSpan", "2");
                th.innerHTML = "学校名▼";
                th.setAttribute("onclick", "filter('school')");
                tr.appendChild(th);
                var th = document.createElement( 'th' );
                th.setAttribute("rowSpan", "2");
                th.innerHTML = "担当▼";
                th.setAttribute("onclick", "filter('user')");
                tr.appendChild(th);

                if (dispYear && dispMonth) {
                    year = dispYear.textContent
                    month = dispMonth.textContent
                } else {
                    nowDate = new Date();
                    year = nowDate.getYear();             // 年
                    month = nowDate.getMonth() + 1; // 月
                }

                var days = new Date(year, month, 0).getDate(); // 日数
                dateT = ["日","月","火","水","木","金","土"];

                var reportTheadObj = document.getElementById("reportThead");
                for (var i =reportTheadObj.childNodes.length-1; i>=0; i--) {
                    reportTheadObj.removeChild(reportTheadObj.childNodes[i]);
                 }

                for ( var i = 0; i < days; i++) {
                    var date = new Date(year, month - 1,  i + 1);
                    var th = document.createElement( 'th' );
                    if (date.getDay() == 0) {
                        th.innerHTML = '<div style="color: red;">' + (i + 1) + '</div>';
                    } else if (date.getDay() == 6) {
                        th.innerHTML = '<div style="color: blue;">' + (i + 1) + '</div>';
                    } else {
                        th.innerHTML = i + 1;
                    }
                    th.style.width = "30px";
                    tr.appendChild(th);
                }
                reportTheadObj.appendChild(tr);

                var tr = document.createElement( 'tr' );
                for ( var i = 0; i < days; i++) {
                    var date = new Date(year, month - 1,  i + 1);
                    var th = document.createElement( 'th' );
                    if (date.getDay() == 0) {
                        th.innerHTML = '<div style="color: red;">' + dateT[date.getDay()] + '</div>';    // 曜日
                    } else if (date.getDay() == 6) {
                        th.innerHTML = '<div style="color: blue;">' + dateT[date.getDay()] + '</div>';    // 曜日
                    } else {
                        th.innerHTML = dateT[date.getDay()];    // 曜日
                    }
                    th.style.width = "30px";
                    tr.appendChild(th);
                }
                reportTheadObj.appendChild(tr);

                // シフト入力タブ
                tableRows = document.getElementById("workShiftBody");
//console.log('reportSpanChange() tableRows.childElementCount:' + tableRows.childElementCount);
//console.log('reportSpanChange() listFlag:' + listFlag);
                if (tableRows.childElementCount > 0 && listFlag) {
                    while (tableRows.hasChildNodes()) {
                        tableRows.removeChild(tableRows.firstChild);
                    }
                } else if (tableRows.childElementCount == 0 && !listFlag) {
                    dateSpan.tableName = "workShift";
//console.log('reportSpanChange() 1 getWorkShiftList');
                    getWorkShiftList(dateSpan, monthForward);
                }
                if (listFlag) {
//console.log('reportSpanChange() 2 getWorkShiftList');
                    getWorkShiftList(dateSpan, monthForward);
                }

                return;
            }
        }

        if (document.getElementById("reportListView").classList.contains("active")) {
            //業務報告一覧タブ
            tableRows = document.getElementById("reportListBody");
            if (tableRows.childElementCount > 0 && listFlag) {
                while (tableRows.hasChildNodes()) {
                    tableRows.removeChild(tableRows.firstChild);
                }
            } else if (tableRows.childElementCount == 0 && !listFlag) {
                dateSpan.tableName = "reportList";
                getManageList(dateSpan);
            }
            if (listFlag) {
                getReportList(dateSpan);
            }
        } else if (document.getElementById("ictListView").classList.contains("active")) {
//console.log('reportSpanChange() ictListView');
            //ICT活用授業報告一覧
            tableRows = document.getElementById("ictListBody");
            if (tableRows.childElementCount > 0 && listFlag) {
                while (tableRows.hasChildNodes()) {
                    tableRows.removeChild(tableRows.firstChild);
                }
            } else if (tableRows.childElementCount == 0 && !listFlag) {
                dateSpan.tableName = "ictList";
//                getIctList(dateSpan);
                getManageList(dateSpan);
            }
//console.log('reportSpanChange() listFlag:' + listFlag);
            if (listFlag) {
                getIctList(dateSpan);
            }
        } else if (document.getElementById("demandListView").classList.contains("active")) {
            //要望・トラブル等報告一覧
            tableRows = document.getElementById("demandListBody");
            if (tableRows.childElementCount > 0 && listFlag) {
                while (tableRows.hasChildNodes()) {
                    tableRows.removeChild(tableRows.firstChild);
                }
            } else if (tableRows.childElementCount == 0 && !listFlag) {
                dateSpan.tableName = "demandList";
                getManageList(dateSpan);
            }
//console.log('reportSpanChange() listFlag' + listFlag);
            if (listFlag) {
//console.log('reportSpanChange() dataList');
                getDemandList(dateSpan);
            }
        }
    }
