function setteiShuseiStep(){
    location.href = "mokuhyoSettei.html";
}

function nextStep(){
    saveMokuhyo();
}

function saveMokuhyo(){
    mokuhyoObjUtil.saveDBCurrentMokuhyoObj(moveNext);
}

function moveNext(){
    mokuhyoObjUtil.clearSession();
    location.href = "../menu";
}

$(function () {
    "use strict";
    
    loginCheck();
    
    mokuhyoObjUtil.loadData();
    
    $('#nextButton').on('click', function () {
        nextStep();
    });
    
    $('#shuuseiButton').on('click', function () {
        setteiShuseiStep();
    });
    
    $('#menu').on('touchend', function () {
        location.href = "../menu/";
    });

});