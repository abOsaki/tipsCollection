function packageSerchObject(itemDataList) {
    this.itemDataList = itemDataList;
    this.group = document.getElementById("group").value;
    this.school = document.getElementById("school").value;
    this.grade = document.getElementById("grade").value;
    this.curriculum = document.getElementById("curriculum").value;
    this.unit = document.getElementById("unit").value;
    return this
};

function rollbackBaseInfoPackage(packageSerchObject) {
    unitSelectedCallBack = function() {
        document.getElementById("unit").value = packageSerchObject.unit;
        unitSelectedCallBack = null
    };
    document.getElementById("group").value = packageSerchObject.group;
    groupSelecter();
    document.getElementById("school").value = packageSerchObject.school;
    document.getElementById("grade").value = packageSerchObject.grade;
    document.getElementById("curriculum").value = packageSerchObject.curriculum;
    unitSelecter(packageSerchObject.curriculum)
}