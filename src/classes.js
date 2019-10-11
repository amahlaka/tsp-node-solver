class geoPointData{
    constructor(name, lat, lon, index){
        this.name = name;
        if (lat[lat.length - 1] == 'S') {
            this.lat = '-' + lat.slice(0, lat.length - 1);
        } else {
            this.lat = lat.slice(0, lat.length - 1);
        }
        this.lon = lon;
        this.index = index;
        this.position = {"lat":this.lat, "lon":this.lon}
        this.costMatrix = [];
        this.nameMatrix = []; // [{name,lat,lon,index,position}]
        if(typeof(classDebug)!= 'undefined'){
            console.debug(this);
        }
    }
    appendMatrix(index,cost,name){
            this.costMatrix.push(cost);
            this.nameMatrix.push({"name":name,"distance":cost})
    }

}

module.exports = {
    geoPointData
}