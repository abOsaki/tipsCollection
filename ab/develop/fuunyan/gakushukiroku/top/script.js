function loginStep(){
    var check = checkLogin();
    if(check){
        //セッションに生徒の情報をセットする
        setStuent();
        //クッキー保存
        setCookie(moveMenu);
    }else{
        alert('ログインに失敗しました')
    }
}

function checkLogin(){
    return true;
}

var cvUserID
function setStuent(){
    var select = document.getElementById('stuentSelect');
    cvUserID = select.value;
    sessionStorage.setItem('userID', cvUserID);
    
    var index = select.selectedIndex;
    var userName = select.options[index].textContent;
    sessionStorage.setItem('userName', userName);
}

function moveMenu(){
    location.href = "../menu/";
}

function removeStudent(){
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('userName');
}

function getCookie(){
    var sendData = {
        'command' : "getCookieValue",
        'key' : 'user'
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        setUser(data);
    }).fail(function(data){
    });
}

function setUser(pvData){
    if(pvData){
        var select = document.getElementById('stuentSelect');
        select.value = pvData;
    }
}

function setCookie(pvCallBack){
    var sendData = {
        'command' : "setCookieValue",
        'key' : 'user',
        'value' : cvUserID
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        pvCallBack();
    }).fail(function(data){
    });
}

$(function () {
    "use strict";
    
    removeStudent();
    
    getCookie();
    
    $(document).on('click', '#loginButton', function () {
        
        loginStep();
    });
});