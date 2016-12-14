function saveShukaisouMokuhyoForDB(mokuhyoObject){
    var lapM = getMokuhyoObjMinute(mokuhyoObject.mokuhyoWrapObj);
    var lapS = getMokuhyoObjSeccond(mokuhyoObject.mokuhyoWrapObj);
    var timeM = getMokuhyoObjMinute(mokuhyoObject.mokuhyoTimeObj);
    var timeS = getMokuhyoObjSeccond(mokuhyoObject.mokuhyoTimeObj);
    
    var sendData = {
        'command': "shuukaisouMokuhyoDataInsert",
        'lapM' : lapM,
        'lapS' : lapS,
        'timeM' : timeM,
        'timeS' : timeS
    };
    $.ajax({
        url: 'shuukaisouMokuhyo.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function (data) {
    });
}

function setShuuaisouMokuhyoData(callback){
    var sendData = {
        'command': "shuukaisouMokuhyoDataGet"
    };
    $.ajax({
        url: 'shuukaisouMokuhyo.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function (data) {
        if(data){
            if(data.length > 0){
                callback(data[0]);
            }
        }
        
    });
}

//const ShuukaisouMokuhyoPHP = 'shuukaisouMokuhyo.php';
//const ShuukaisouMokuhyoDataInsertCommand = "shuukaisouMokuhyoDataInsert";
//const ShuukaisouMokuhyoDataGetCommand = "shuukaisouMokuhyoDataGet";