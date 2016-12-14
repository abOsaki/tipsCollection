function getNowDate() {
    "use strict";
    var a, year, month, day, hours, minutes, seconds, nowDate;
    a = new Date();
    year = a.getFullYear();
    month = a.getMonth() + 1;
    day = a.getDate();
    hours = a.getHours();
    minutes = a.getMinutes();
    seconds = a.getSeconds();
    nowDate = year + ("0" + month).slice(-2) + ("0" + day).slice(-2) + ("0" + hours).slice(-2) + ("0" + minutes).slice(-2) + ("0" + seconds).slice(-2);
    return nowDate
}