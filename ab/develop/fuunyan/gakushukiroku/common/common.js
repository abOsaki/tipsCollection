var userID;
var userName;
function loginCheck(){
    userID = sessionStorage.getItem('userID');
    if(!userID){
        location.href = "../top/";
    }
    userName = sessionStorage.getItem('userName');
    //ユーザ名のセット
    setUserName();
}

function setUserName(){
    var userNameDom = document.getElementById('userName');
    if(userNameDom){
        userNameDom.textContent = userName + 'さん';
    }
}

function getAfterDate(dateObj, number) {
    var result = false;
    if (dateObj && dateObj.getTime && number && String(number).match(/^-?[0-9]+$/)) {
        var hosei = Number(number) * 24 * 60 * 60 * 1000;
        result = new Date(dateObj.getTime() + hosei);
    }
    return result;
}

function getTestKubunText(pvID){
    if(pvID == 1){
        return '中間';
    }else if(pvID == 2){
        return '期末';
    }else if(pvID == 3){
        return '学期末';
    }
    throw new Error("未対応のテスト区分ＩＤ　ID:" + pvID);
}

function getKyoukaText(pvID){
    if(pvID == 1){
        return '国語';
    }else if(pvID == 2){
        return '数学';
    }else if(pvID == 3){
        return '英語';
    }else if(pvID == 4){
        return '理科';
    }else if(pvID == 5){
        return '社会';
    }else if(pvID == 6){
        return '音楽';
    }else if(pvID == 7){
        return '美術';
    }else if(pvID == 8){
        return '技術';
    }else if(pvID == 9){
        return '保体';
    }else if(pvID == 0){
        return '全教科';
    }
    throw new Error("未対応の教科ID　ID:" + pvID);
}

function getKyouzaiText(pvID){
    if(pvID == 1){
        return '教材１';
    }else if(pvID == 2){
        return '教材２';
    }else if(pvID == 3){
        return '教材３';
    }else if(pvID == 4){
        return '教材４';
    }else if(pvID == 5){
        return '教材５';
    }
    throw new Error("未対応の教材ID　ID:" + pvID);
}


function getPHPDateByNengappiText(pvNengappiText){
    var year = parseInt(pvNengappiText.split("年")[0]);
    var month = parseInt(pvNengappiText.split("年")[1]);
    if(month < 10){
        month = "0" + month;
    }
    var date = parseInt(pvNengappiText.split("月")[1]);
    if(date < 10){
        date = "0" + date;
    }

    var datedata = year + "-" + month + "-" + date;
    return datedata;
}

function getPHPDateByGappiText(pvGappiText){
    var todayDate = new Date();
    var dateString = pvGappiText;
    var month = parseInt(dateString.split("月")[0]);
    var day = parseInt(dateString.split("月")[1]);
    var date = new Date(todayDate.getFullYear(),month - 1,day);
    var dateObj = new dateInfo(date);
    return dateObj.getToString();
}

var gakushuCommon = function(){
    return {
        getNokoriNissu : function(pvStart,pvEnd){
            //差（ミリ秒数）
            var msDiff = pvEnd.getTime() - pvStart.getTime();
            //差（日数）
            var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24));
            
            if(daysDiff < 0){
                return 0;
            }else{
                return daysDiff;
            }
        }
    }
}();

var dateGakushuCommon = function(){
    return {
        getPHPDateByMonthDay : function(pvMonth,pvDate){
            var todayDate = new Date();
            var date = new Date(todayDate.getFullYear(),pvMonth - 1,pvDate);
            var dateObj = new dateInfo(date);
            return dateObj.getToString();
        },
        getPHPDateByGappiText : function(pvGappiText){
            var todayDate = new Date();
            var dateString = pvGappiText;
            var month = parseInt(dateString.split("月")[0]);
            var day = parseInt(dateString.split("月")[1]);
            var date = new Date(todayDate.getFullYear(),month - 1,day);
            var dateObj = new dateInfo(date);
            return dateObj.getToString();
        },
        getPHPDateByNengappiText : function (pvNengappiText){
            var year = parseInt(pvNengappiText.split("年")[0]);
            var month = parseInt(pvNengappiText.split("年")[1]);
            if(month < 10){
                month = "0" + month;
            }
            var date = parseInt(pvNengappiText.split("月")[1]);
            if(date < 10){
                date = "0" + date;
            }

            var datedata = year + "-" + month + "-" + date;
            return datedata;
        },
        getPHPDateByNengappi : function(pvYear,pvMonth,pvDay){
            var year = parseInt(pvYear);
            var month = parseInt(pvMonth);
            if(month < 10){
                month = '0' + month;
            }
            var date = parseInt(pvDay);
            if(date < 10){
                date = "0" + date;
            }

            var datedata = year + "-" + month + "-" + date;
            return datedata;
        },
        getGappiTextByPHPDate : function(pvPHPDate){
            var month = pvPHPDate.split("-")[1];
            var day = pvPHPDate.split("-")[2];
            var result = month + "月" + day + "日";
            return result;
        },
        getNenGappiTextByPHPDate : function(pvPHPDate){
            var year = pvPHPDate.split("-")[0];
            var month = pvPHPDate.split("-")[1];
            var day = pvPHPDate.split("-")[2];
            var result = year + "年" + month + "月" + day + "日";
            return result;
        },
        setPHPDateSession : function(pvPHPDate){
            sessionStorage.setItem('date',pvPHPDate);
        },
        getPHPDateSession : function(){
            var result = sessionStorage.getItem('date');
            return result;
        }
    };
}();