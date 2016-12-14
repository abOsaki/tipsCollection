//var quesListBefore = [];
//var quesListAfter = [];
//
//function setQuesListBefore() {
//    var workbookEle, quesList, i;
//    
//    workbookEle = document.getElementById("workbookBody");
//    
//    if(workbookEle.hasChildNodes) {
//        quesListBefore = [];
//        quesList = workbookEle.children;
//        
//        for (i = 0; i < quesList.length; i++) {
//            quesListBefore.push(quesList[i].firstChild.firstChild.value);   
//        }
//    } else {
//        quesListBefore = [];
//    }
//}
//
//function setQuesListAfter(quesList) {
//    var workbookEle, quesList, i;
//    
//    workbookEle = document.getElementById("workbookBody");
//    
//    if(workbookEle.hasChildNodes) {
//        quesListAfter = [];
//        quesList = workbookEle.children;
//    
//        for (i = 0; i < quesList.length; i++) {
//            quesListAfter.push(quesList[i].firstChild.firstChild.value);   
//        }
//    } else {
//        quesListAfter = [];   
//    }
//}
//
//function resetQuesList() {
//    quesListBefore = [];
//    quesListAfter = [];
//}
//
//function getInsertedQuestion() {
//    var i, j, insertedQuestion = [];
//    
//    for (i = 0; i < quesListAfter.length; i++) {
//        var exist = false;
//        
//        for (j = 0; j < quesListBefore.length; j++) {
//            if (quesListAfter[i] == quesListBefore[j]) {
//                exist = true;   
//            }
//        }
//        
//        if (!exist) {
//            insertedQuestion.push(quesListAfter[i]);   
//        }
//    }
//    
//    console.log(insertedQuestion);
//    return insertedQuestion;
//}
//
//function getRemovedQuestion() {
//    var i, j, removedQuestion = [];
//    
//    for (i = 0; i < quesListBefore.length; i++) {
//        var exist = false;
//        
//        for (j = 0; j < quesListAfter.length; j++) {
//            if (quesListBefore[i] == quesListAfter[j]) {
//                exist = true;
//            }
//        }
//        
//        if (!exist) {
//            removedQuestion.push(quesListBefore[i]);   
//        }
//    }
//    
//    console.log(removedQuestion);
//    return removedQuestion;
//}
//
//function questionBelongCountUp(quesList) {
//    var xmlhr, response
//   
//    xmlhr = new XMLHttpRequest();
//    xmlhr.open("POST", "./php/questionBelongCountUp.php", true);
//    xmlhr.onreadystatechange = function () {
//        if (xmlhr.readyState === 4 && xmlhr.status === 200) {
//            response = xmlhr.responseText;
//            //console.log(response);
//        }
//    };
//    xmlhr.send(JSON.stringify(quesList));
//}
//
//function questionBelongCountDown(quesList) {
//    var xmlhr, response
//   
//    xmlhr = new XMLHttpRequest();
//    xmlhr.open("POST", "./php/questionBelongCountDown.php", true);
//    xmlhr.onreadystatechange = function () {
//        if (xmlhr.readyState === 4 && xmlhr.status === 200) {
//            response = xmlhr.responseText;
//            //console.log(response);
//        }
//    };
//    xmlhr.send(JSON.stringify(quesList));
//}