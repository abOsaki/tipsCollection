function moveExecute(pvID){
    var form = document.createElement('form');
    document.body.appendChild(form);
    var input = document.createElement('input');
    input.setAttribute('type','hidden');
    input.setAttribute('name','id');
    input.setAttribute('value',pvID);
    form.appendChild(input);
    form.setAttribute('action','execute.php');
    form.setAttribute('method', 'post');
    form.submit();
}

$(function () {
    "use strict";
    
    $('.executeBtn').on('click', function () {
        var id = this.value;
        moveExecute(id);
        
    });
});