function educationSerchObject(itemDataList, eduType) {
    this.itemDataList = itemDataList;
    this.eduType = eduType;
    this.question = document.getElementById("ques").checked;
    this.package = document.getElementById("pack").checked;
    this.group = document.getElementById("group").value;
    this.school = document.getElementById("school").value;
    this.grade = document.getElementById("grade").value;
    this.curriculum = document.getElementById("curriculum").value;
    this.unit = document.getElementById("unit").value;
    return this
}

function rollbackBaseInfoEducation(educationSerchObject) {
    document.getElementById("ques").checked = educationSerchObject.question;
    document.getElementById("pack").checked = educationSerchObject.package;
    unitSelectedCallBack = function() {
        document.getElementById("unit").value = educationSerchObject.unit;
        unitSelectedCallBack = null
    };
    document.getElementById("group").value = educationSerchObject.group;
    groupSelecter();
    document.getElementById("school").value = educationSerchObject.school;
    document.getElementById("grade").value = educationSerchObject.grade;
    document.getElementById("curriculum").value = educationSerchObject.curriculum;
    unitSelecter(educationSerchObject.curriculum)
}