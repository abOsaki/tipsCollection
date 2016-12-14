function shuukeiMode(){
    this.ready = function(){
        
    }
    
    this.setData = function(data){
        
    }
    
    this.notifyHyoujiPushed = function(){
        //データを取得する
        changeData();
    }
    
    this.notifyFocus= function(){
        setGraph();
        changeData();
    }
    
    this.getSelectedDate = function(){
        return getSelectedDate();
    }
    return this;
    
    function setGraph(){
        shuukaisouCommon.setShukeiGraph();
    }
    
    function changeData(){
        //スタートタイムとエンドタイムを取得する
        var startTime = shuukaisouCommon.getShukeiStartTime();
        var endTime = shuukaisouCommon.getShukeiEndTime();
        //データ取得
        getShuukaisouDataFromDateRange(startTime,endTime,getNewData);
    }
    
    function getNewData(data){
        var kind = getKubunFlag();
        shuukaisouCommon.setShukeiGraphData(data,kind);
    }
    
    function getKubunFlag(){
        var kubunSelect = document.getElementById("kubun");
        var result = kubunSelect.selectedIndex;
        return result;
    }
    
    function getSelectedDate(){
        return shuukaisouCommon.getShuukeiSelectedDate();
    }
    
}