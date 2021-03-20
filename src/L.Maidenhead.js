/*
 * L.Maidenhead displays a Maidenhead Locator of lines on the map.
 */

L.Maidenhead = L.LayerGroup.extend({

	
	options: {
		// Line and label color
		color: 'rgba(255, 0, 0, 0.4)',
		// Redraw on move or moveend
		redraw: 'move'
	},

	initialize: function (options) {
		L.LayerGroup.prototype.initialize.call(this);
		L.Util.setOptions(this, options);

	},

	onAdd: function (map) {
		this._map = map;
		var grid = this.redraw();
		this._map.on('viewreset '+ this.options.redraw, function () {
			grid.redraw();
		});

		this.eachLayer(map.addLayer, map);
	},
	
	onRemove: function (map) {
		// remove layer listeners and elements
		map.off('viewreset '+ this.options.redraw, this.map);
		this.eachLayer(this.removeLayer, this);
	},

	redraw: function () {
		var d3 =         new Array(20,10,10,10,10,10,1 ,1 ,1 ,1 ,1/24,1/24,1/24,1/24,1/24,1/240,1/240,1/240,1/240,1/240/24,1/240/24 );
		var lat_cor =    new Array(0 ,8 ,8 ,8 ,10,14,6 ,8 ,8 ,8 ,1.4 ,2.5 ,3   ,3.5 ,4   ,4    ,3.5  ,3.5  ,3    ,1.8     ,1.6      );
		var bounds = map.getBounds();
        
    
        var zoom = map.getZoom();
        console.log("zoom:",zoom);
        var unit = d3[zoom];
        
        console.log("unit:",unit);

		var lcor = lat_cor[zoom];
		var w = bounds.getWest();
		var e = bounds.getEast();
		var n = bounds.getNorth();
        var s = bounds.getSouth();
        

        L.circle([n,w], 5, {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.8
        }).addTo(map);

		if (zoom==1) {var c = 2;} else {var c = 0.1;}
		if (n > 85) n = 85;
		if (s < -85) s = -85;
		var left = Math.floor(w/(unit*2))*(unit*2);
		var right = Math.ceil(e/(unit*2))*(unit*2);
		var top = Math.ceil(n/unit)*unit;
        var bottom = Math.floor(s/unit)*unit;
        
        var myLeft = Math.floor(-71.297798/(unit*2))*(unit*2);
        var myRight = Math.ceil(-71.297798/(unit*2))*(unit*2);
        console.log("unit:",unit);
        console.log("myLeft:",myLeft);
        console.log("myRight:",myRight);

		this.eachLayer(this.removeLayer, this);
		for (var lon = left; lon < right; lon += (unit*2)) {
   
			for (var lat = bottom; lat < top; lat += unit) {
                
                var locatorString = this._getLocator(lon,lat);
                console.log(locatorString);
                //console.log("lat:",n,s);
                //console.log("lon:",w,e);
                //console.log('-----');

            var bounds = [[lat,lon],[lat+unit,lon+(unit*2)]];

            var b1 = [[lat,lon],[lat+unit/2,lon+unit]];
            var b2 = [[lat+unit/2,lon],[lat+unit,lon+unit]];
            var b3 = [[lat,lon+unit],[lat+unit/2,lon+(unit*2)]];


            var squareLeft = lon;
            var squareBottom = lat;
            var squareTop = lat+unit;
            var squareRight = lon+(unit*2);
            
            console.log("left,right:",squareLeft,squareRight);
            console.log("top,bottom:",squareTop,squareBottom)
            
            
            
            
            var subcolor = 'rgba(255, 0, 0, 0.4)';
            var dashArray = '10, 10';
            this.addLayer(L.rectangle(b1, {color: subcolor, weight: 1, dashArray: dashArray, dashOffset: '0', fill:false, interactive: false}));
            this.addLayer(L.rectangle(b2, {color: subcolor, weight: 1, dashArray: dashArray, dashOffset: '0', fill:false, interactive: false}));
            this.addLayer(L.rectangle(b3, {color: subcolor, weight: 1, dashArray: dashArray, dashOffset: '0', fill:false, interactive: false}));

            this.addLayer(L.rectangle(bounds, {color: this.options.color, weight: 1, fill:false, interactive: false}));
			//var pont = map.latLngToLayerPoint([lat,lon]);
			//console.log(pont.x);
			this.addLayer(this._getLabel(lon+unit-(unit/lcor),lat+(unit/2)+(unit/lcor*c)));
			}
		}
		return this;
	},
    	
	_getLabel: function(lon,lat) {
	  var title_size = new Array(0 ,10,12,16,20,26,12,16,24,36,12  ,14  ,20  ,36  ,60  ,12   ,20   ,36   ,60   ,12      ,24       );
      var zoom = map.getZoom();
      console.log("zoom:",zoom);

      var size = title_size[zoom]+'px';
      var title = '<span style="cursor: default;"><font style="color:'+this.options.color+'; font-size:'+size+'; font-weight: 900; ">' + this._getLocator(lon,lat) + '</font></span>';
      
      /*
      if(zoom>15) {
        var title = '<span style="cursor: default;"><font style="color: white; font-size:'+size+'; font-weight: 900; -webkit-text-stroke: .5px black">' + this._getLocator(lon,lat) + '</font></span>';
      }
      else {
        var title = '<span style="cursor: default;"><font style="color:'+this.options.color+'; font-size:'+size+'; font-weight: 900; ">' + this._getLocator(lon,lat) + '</font></span>';
      }
      */
      var myIcon = L.divIcon({className: 'my-div-icon', html: title});
      var marker = L.marker([lat,lon], {icon: myIcon}, clickable=false);
      return marker;
	},
	
	_getLocator: function(lon,lat) {
	  var ydiv_arr=new Array(10, 1, 1/24, 1/240, 1/240/24);
	  var d1 = "ABCDEFGHIJKLMNOPQR".split("");
	  var d2 = "ABCDEFGHIJKLMNOPQRSTUVWX".split("");
      //var d4 =         new Array(0 ,1 ,1 ,1 ,1 ,1 ,2 ,2 ,2 ,2 ,3   ,3   ,3   ,3   ,3   ,4    ,4    ,4    ,4    ,5       ,5        );
      var d4 = new Array(0,1,1,1,1,1,2,2,2,2,3,3,3,3,3,4,4,4,4,5,5);
      var locator = "";
      var x = lon;
      var y = lat;
      var precision = d4[map.getZoom()];
      //precision=5;
      console.log("precision:",precision)
      while (x < -180) {x += 360;}
      while (x > 180) {x -=360;}
      x = x + 180;
      y = y + 90;
      locator = locator + d1[Math.floor(x/20)] + d1[Math.floor(y/10)];
      for (var i=0; i<4; i=i+1) {
		if (precision > i+1) {
        rlon = x%(ydiv_arr[i]*2);
        rlat = y%(ydiv_arr[i]);
			if ((i%2)==0) {
				locator += Math.floor(rlon/(ydiv_arr[i+1]*2)) +""+ Math.floor(rlat/(ydiv_arr[i+1]));
			} else {
				locator += d2[Math.floor(rlon/(ydiv_arr[i+1]*2))] +""+ d2[Math.floor(rlat/(ydiv_arr[i+1]))];	
			}
		}
	  }  
      return locator;
	},

  
	

});

L.maidenhead = function (options) {
	return new L.Maidenhead(options);
};
