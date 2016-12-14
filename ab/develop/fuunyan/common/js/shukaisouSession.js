function setMokuhyoObj(mokuhyoObj){
    var data = JSON.stringify(mokuhyoObj);
    sessionStorage.setItem("shukaisouMokuhyo",data);
}

function getMokuhyoObj(){
    var data = sessionStorage.getItem("shukaisouMokuhyo");
    if(data){
        var result = JSON.parse(data);
        return result;
    }
}

function setRecordObj(recordObj){
    var data = JSON.stringify(recordObj);
    sessionStorage.setItem("shukaisouRecord",data);
}

function getRecordObj(){
    var data = sessionStorage.getItem("shukaisouRecord");
    if(data){
        var result = JSON.parse(data);
        return result;
    }
}

