/*Grate.Map.prototype.makeGreatCircleRoute = function(from, to) {
    var psrc = this.map.projection;
    var pdst = new OpenLayers.Projection('EPSG:4326');
    var from = from.transform(psrc, pdst);
    var to = to.transform(psrc, pdst);
    var rt = 
    var rtpts = [];
    var lns = [];
    var buf = [];
    var mapext = this.map.getMaxExtent().clone().transform(this.map.projection, new OpenLayers.Projection('EPSG:4326'));
    var split_wayward_routes = true;
    if(split_wayward_routes) {
        var oobl = false;
        var oobr = false;
        for(var i=0; i<rt.length; i++) {
            var flipped = false;
            var newpt = new OpenLayers.Geometry.Point(rt[i].x, rt[i].y);
            if(!mapext.containsBounds(newpt)) {
                if(newpt.x > mapext.right) {
                    newpt.x = mapext.left + (newpt.x - mapext.right);
                    if(!oobl) flipped = true;
                    oobl = true;
                } else if(newpt.x < mapext.left){
                    newpt.x = mapext.right - (mapext.left - newpt.x);
                    if(!oobr) flipped = true;
                    oobr = true;
                }
                if(flipped && buf.length) {
                    lns.push(new OpenLayers.Geometry.LineString(buf));
                    buf = [];
                }
            } 
            buf.push(newpt);
        }
        if(buf.length) lns.push(new OpenLayers.Geometry.LineString(buf));
    } else {
        var rtpts = [];
        for(var i=0; i<rt.length; i++) {
            rtpts.push(new OpenLayers.Geometry.Point(rt[i].x, rt[i].y));
        }
        lns.push(new OpenLayers.Geometry.LineString(rtpts));
    }

    var rtgeo = new OpenLayers.Geometry.MultiLineString(lns);
    rtgeo = rtgeo.clone().transform(pdst, psrc);

    return rtgeo;
}
*/
Grate = {};

Grate.R = 6371 //km = 3959 miles

Grate.radians = function(deg) {
    return deg*Math.PI/180;
}

Grate.degrees = function(rad) {
    return rad*180.0/Math.PI;
}

Grate.dms2decdeg = function(d, m, s) {
    dd = Number(d);
    dd = dd + m/60.0;
    dd = dd + s/Math.pow(60.0,2.0);
    return dd;
}

Grate.haversine = function(pt1, pt2) {
    // Calculate great circle distance between points on a spheriod
    var R = Grate.R;
    var lat1 = pt1[0];
    var lon1 = pt1[1];
    var lat2 = pt2[0];
    var lon2 = pt2[1];

    lat1 = Grate.radians(lat1);
    lon1 = Grate.radians(lon1);
    lat2 = Grate.radians(lat2);
    lon2 = Grate.radians(lon2);
    var dLat = lat2-lat1;
    var dLon = lon2-lon1;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
        Math.cos(lat1) * Math.cos(lat2) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

Grate.great_circle_bearing = function(pt1, pt2) {       //Note longitude is 0 at Greenich - in western hemisphere and positive in eastern
    var lat1 = pt1[0];
    var lon1 = pt1[1];
    var lat2 = pt2[0];
    var lon2 = pt2[1];
    lat1 = Grate.radians(lat1)
    lon1 = Grate.radians(lon1)
    lat2 = Grate.radians(lat2)
    lon2 = Grate.radians(lon2)
    var dLon = lon2 - lon1     //Longitude is east-west distance...note this returns directional value (might be bigger than pi but cos symetric around 0) 
                                       //Note we switch sin and cos for latitude b/c 0 latitude is at equator    
    var y = Math.sin(dLon)*Math.cos(lat2)  //This calculates y position in cartesian coordinates with radius earth=1
    var x = Math.cos(lat1)*Math.sin(lat2) - 
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon)
    var brng = Grate.degrees(Math.atan2(y, x))     //Note bearing is the differential direction of the arc given in degrees relative to east being 0
    return brng  //Using the plane carie (sp?) projection EPSG:4326 (sending long to x and lat to y) brng is also differential direction of arc in projection
}

Grate.great_circle_midpoint = function(pt1, pt2) {
    var lat1 = pt1[0];
    var lon1 = pt1[1];
    var lat2 = pt2[0];
    var lon2 = pt2[1];
    lat1 = Grate.radians(lat1);
    lon1 = Grate.radians(lon1);   
    lat2 = Grate.radians(lat2);
    lon2 = Grate.radians(lon2);
    var dLon = lon2 - lon1;
    var Bx = Math.cos(lat2) * Math.cos(dLon);
    var By = Math.cos(lat2) * Math.sin(dLon);
    var lat3 = Math.atan2(Math.sin(lat1)+Math.sin(lat2),
        Math.sqrt((Math.cos(lat1)+Bx)*(Math.cos(lat1)+Bx) + By*By));
    var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
    return [Grate.degrees(lat3), Grate.degrees(lon3)];
}

Grate.great_circle_endpoint = function(pt1, brng, d) {
    var R = Grate.R;
    var lat1 = pt1[0];
    var lon1 = pt1[1];
    lat1 = Grate.radians(lat1);
    lon1 = Grate.radians(lon1);
    lat2 = Math.asin(Math.sin(lat1)*Math.cos(d/R) + 
            Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng));
    lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1), 
            Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));
    return [Grate.degrees(lat2), Grate.degrees(lon2)];
}

Grate.great_circle_point = function(pt1, pt2, ttl) {
    var mp = Grate.great_circle_midpoint(pt1, pt2);
    var rt = [pt1];
    if(ttl > 0) {
        var ttl = ttl - 1;
        rt = rt.concat(Grate.great_circle_point(pt1, mp, ttl));
        rt = rt.concat(Grate.great_circle_point(mp, pt2, ttl));
    }
    rt.push(pt2);
	return rt;
}
Grate.great_circle_route = function(pt1, pt2, ttl, bounds) {
    var mp = Grate.great_circle_midpoint(pt1, pt2);
    var rt = [pt1];
    if(ttl > 0) {
        var ttl = ttl - 1;
        rt = rt.concat(Grate.great_circle_point(pt1, mp, ttl, bounds));
        rt = rt.concat(Grate.great_circle_point(mp, pt2, ttl, bounds));
    }
    rt.push(pt2);

	var buf = [];
	var lns = [];
    var oobl = false;
    var oobr = false;
    for(var i=0; i<rt.length; i++) {
        var flipped = false;
        var newpt = new L.Point(rt[i][0], rt[i][1]);
        if(!bounds.contains(newpt)) {			
			//bum ref
			var right = bounds.max.x;			
			var left = bounds.min.x;
            if(newpt.x > right) {
                newpt.x = Number(left + (newpt.x - right));
                if(!oobl) flipped = true;
                oobl = true;
            } else if(newpt.x < left){
                newpt.x = Number(right - (left - newpt.x));
                if(!oobr) flipped = true;
                oobr = true;
            }
            if(flipped && buf.length) {
                lns.push(buf);
                buf = [];
            }
        }
		 
        buf.push([newpt.x, newpt.y]);
		
    }
    if(buf.length) {	
		lns.push(buf);
	}
	var rtgeo = [];
    for(var i=0; i<lns.length; i++) {
	    for(var j=0; j<lns[i].length; j++) {
			rtgeo.push(lns[i][j]); 
		}
	}
    return [rtgeo];
}

Grate.bezier_route = function(from, to) {
    var x0 = from[0];
    var y0 = from[1];
    var x1 = to[0];
    var y1 = to[1];

    var dx = x1 - x0;
    var dy = y1 - y0;

    var bzx = x0 + dx/4;
    var bzy = y1;

    var res = 100;

    var pts = [];
    for(var t=0.0; t<1.0; t += 1.0/res) {
        var x = (1-t) * (1-t) * x0 + 2 * (1-t) * t * bzx + t * t * x1;
        var y = (1-t) * (1-t) * y0 + 2 * (1-t) * t * bzy + t * t * y1;
        pts.push([x, y]);
    }
    if(!(to[0] == pts[pts.length-1][0] && to[1] == pts[pts.length-1][1])) {
		var to_clone = [to[0],to[1]];
        pts.push(to_clone);
		
	}
    return [pts];
}
