function getSessionExpire(){
    var sendData = {
        'command' : "sessionExpire"
    };
    $.ajax({
        url: '../shuukaisou.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
        error:function(exception)
        {
            var errorChekck = exception;
        }
    }).done(function(data){
        alert(data);
    });
}

function saveShuukaisouData(recodeObj){
    var recordData = JSON.stringify(recodeObj);
    var sendData = {
        'command': "shuukaisouDataInsert",
        'data' : recordData,
        'try': recodeObj.kaime,
    };
    $.ajax({
        url: '../shuukaisou.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
        success:function(result)//反応があったら
        {
            var successCheck = result;
        },
        error:function(exception)
        {
            var errorChekck = exception;
        }
    }).done(function (data) {
        var responseCheck = data;
    });
}

function getShuuaisouData(){
    var sendData = {
        'command': "shuukaisouDataGet"
    };
    $.ajax({
        url: '../shuukaisou.php',
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

function getShuuaisouDataFromDateAndKaime(dateData,pvKaime,callback){
    var startDateTime = dateData + " 00:00:00";
    var endDateTime = dateData + " 23:59:59";
    
    var sendData = {
        'command': "shuukaisouDataGetFromDateTry",
        'startDateTime' : startDateTime,
        'endDateTime' : endDateTime,
        'try' : pvKaime
    };
    $.ajax({
        url: '../shuukaisou.php',
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

function getShuuaisouDataFromDate(dateData,callback){
    var startDateTime = dateData + " 00:00:00";
    var endDateTime = dateData + " 23:59:59";
    
    var sendData = {
        'command': "shuukaisouDataGetFromDate",
        'startDateTime' : startDateTime,
        'endDateTime' : endDateTime
    };
    $.ajax({
        url: '../shuukaisou.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function (data) {
        /*
        if(data){
            if(data.length > 0){
                var recordData = data[0].data;
                var recodeObj = JSON.parse(recordData);
                callback(recodeObj);
                return;
            }
        }
        */
        callback(data);
    });
}

function getShuukaisouDataFromDateRange(startDate,endDate,callback){
    var startDateTime = startDate + " 00:00:00";
    var endDateTime = endDate + " 23:59:59";
    
    var sendData = {
        'command': "shuukaisouDataGetFromDate",
        'startDateTime' : startDateTime,
        'endDateTime' : endDateTime
    };
    $.ajax({
        url: '../shuukaisou.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function (data) {
        if(data){
            if(data.length > 0){
                var result = [];
                for(var i = 0; i < data.length; i++){
                    var item = data[i];
                    result.push(item);
                }
                
                //var recodeObj = JSON.parse(data);
                callback(result);
                return;
            }
        }
        callback(null);
    });
}

//const ShuukaisouPHP = '../shuukaisou.php';
//const ShuukaisouDataInsertCommand = "shuukaisouDataInsert";
//const ShuukaisouDataGetCommand = "shuukaisouDataGet";
//const ShuukaisouDataGetFromDateCommand = "shuukaisouDataGetFromDate";