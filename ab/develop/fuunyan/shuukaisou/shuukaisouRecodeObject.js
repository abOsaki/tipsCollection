function shuukaisouRecodeObject(shuukaiNo,mokuhyoWrapTimeText,mokuhoTimeText,wrapArray,timeArray,avTime,suTime,mokuhyoObject,pvKaime,pvKyoriOneTrack){
    this.shuukai = shuukaiNo;
    this.mokuhyoWrap = mokuhyoWrapTimeText;
    this.mokuhyoTime = mokuhoTimeText;
    this.wraps = wrapArray;
    this.times = timeArray;
    this.aveTime = avTime;
    this.sumTime = suTime;
    this.mokuhyoObj = mokuhyoObject;
    this.kaime = pvKaime;
    this.kyoriOneTrack = pvKyoriOneTrack;
    
    return this;
}
