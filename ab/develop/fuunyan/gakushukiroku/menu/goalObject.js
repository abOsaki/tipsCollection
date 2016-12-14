//期間目標
var periodGoalObject = function(pvRow){
    this.curriculumID = pvRow.curriculumID;
    this.goalPoint = pvRow.goalPoint;
    this.stamp = pvRow.stamp;
};
periodGoalObject.prototype.getMokuhyoText = function(){
    var kyoukaText = getKyoukaText(this.curriculumID);
    var de = 'で';
    var tensuu = this.goalPoint;
    var bunnmatu = '点以上とる！';
    var result = kyoukaText + de + tensuu + bunnmatu;
    return result;
};

//科目別目標
var kamokubetuGoalObject = function(pvRow){
    this.curriculumID = pvRow.curriculumID;
    this.goalPoint = pvRow.goalPoint;
};

kamokubetuGoalObject.prototype.setKamokuTD = function(){
    var taishoTD;
    if(this.curriculumID == 1){
        taishoTD = document.getElementById('kokugoTD');
    }else if(this.curriculumID == 2){
        taishoTD = document.getElementById('suugakuTD');
    }else if(this.curriculumID == 3){
        taishoTD = document.getElementById('eigoTD');
    }else if(this.curriculumID == 4){
        taishoTD = document.getElementById('rikaTD');
    }else if(this.curriculumID == 5){
        taishoTD = document.getElementById('shakaiTD');
    }else{
        throw new Error('未対応のcurriculumID : ' + this.curriculumID);
    }
    taishoTD.textContent = this.goalPoint;
};