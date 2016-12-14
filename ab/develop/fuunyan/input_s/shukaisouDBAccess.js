function saveShuukaisouData(recodeObj){
    var recordData = JSON.stringify(recodeObj);
    var sendData = {
        'command': ShuukaisouDataInsertCommand,
        'data' : recordData
    };
    $.ajax({
        url: ShuukaisouPHP,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function (data) {
    });
}

function getShuuaisouData(){
    var sendData = {
        'command': ShuukaisouDataGetCommand
    };
    $.ajax({
        url: ShuukaisouPHP,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function (data) {
        if(data){
            if(data.length > 0){
                var recordData = data[0].data;
                var recodeObj = JSON.parse(recordData);
            }
        }
    });
}

function getShuuaisouDataFromDate(dateData,callback){
    var startDateTime = dateData + " 00:00:00";
    var endDateTime = dateData + " 23:59:59";
    
    var sendData = {
        'command': ShuukaisouDataGetFromDateCommand,
        'startDateTime' : startDateTime,
        'endDateTime' : endDateTime
    };
    $.ajax({
        url: ShuukaisouPHP,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function (data) {
        if(data){
            if(data.length > 0){
                var recordData = data[0].data;
                var recodeObj = JSON.parse(recordData);
                callback(recodeObj);
                return;
            }
        }
        callback(null);
    });
}

const ShuukaisouPHP = 'shuukaisou.php';
const ShuukaisouDataInsertCommand = "shuukaisouDataInsert";
const ShuukaisouDataGetCommand = "shuukaisouDataGet";
const ShuukaisouDataGetFromDateCommand = "shuukaisouDataGetFromDate";