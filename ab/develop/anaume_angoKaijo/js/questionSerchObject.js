function questionSerchObject(itemDataList) {
    this.itemDataList = itemDataList;
    this.group = document.getElementById("group").value;
    this.school = document.getElementById("school").value;
    this.grade = document.getElementById("grade").value;
    this.curriculum = document.getElementById("curriculum").value;
    this.unit = document.getElementById("unit").value;
    return this
};

function rollbackBaseInfo(questionSerchObject) {
    unitSelectedCallBack = function() {
        document.getElementById("unit").value = questionSerchObject.unit;
        unitSelectedCallBack = null
    };
    document.getElementById("group").value = questionSerchObject.group;
    groupSelecter();
    document.getElementById("school").value = questionSerchObject.school;
    document.getElementById("grade").value = questionSerchObject.grade;
    document.getElementById("curriculum").value = questionSerchObject.curriculum;
    unitSelecter(questionSerchObject.curriculum)
}