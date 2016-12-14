function setEtsuranButton(){
    var eturanButtons = document.getElementsByClassName('executeBtn');
    for(var i = 0; i < eturanButtons.length; i++){
        var eturanButton = eturanButtons[i];
        eturanButton.textContent = '閲覧';
        eturanButton.className = 'executeBtn btn-success';
    }    
}

function moveExecute(pvID){
    var form = document.createElement('form');
    document.body.appendChild(form);
    var input = document.createElement('input');
    input.setAttribute('type','hidden');
    input.setAttribute('name','id');
    input.setAttribute('value',pvID);
    form.appendChild(input);
    form.setAttribute('action','eturan.php');
    form.setAttribute('method', 'post');
    form.submit();
}

$(function () {
    "use strict";
    setEtsuranButton();
    
    $('.executeBtn').on('click', function () {
        var id = this.value;
        moveExecute(id);
        
    });
    
});