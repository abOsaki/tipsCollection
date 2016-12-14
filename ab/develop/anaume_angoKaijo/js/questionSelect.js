$(function() {
    $(window).load(function() {
        var rowCount = document.createElement("tbody").children.length;
        if (rowCount === 0) {
            var questionSerchObject = getSaveQuestion();
            var groupEle = document.getElementById("group");
            if (questionSerchObject != null) {
                loadQuestion(questionSerchObject.itemDataList);
                settingBaseInfoCallBack = function() {
                    rollbackBaseInfo(questionSerchObject)
                }
            }
        }
    })
});