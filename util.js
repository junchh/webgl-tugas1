function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255
    } : null;
}

function onSegment(p, q, r) 
{ 
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && 
            q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y)) {
        return true; 
    }
    return false; 
} 

function pointOrientation(p, q, r) 
{ 
    var val = (q.y - p.y) * (r.x - q.x) - 
            (q.x - p.x) * (r.y - q.y); 
 
    if (val == 0){
        return 0
    }  
    return (val > 0)? 1: 2; 
} 

function pointOrientationWithTolerance(p, q, r, error) 
{ 
    var val = (q.y - p.y) * (r.x - q.x) - 
            (q.x - p.x) * (r.y - q.y); 
 
    if (Math.abs(val) <= error){
        return 0
    }  
    return (val > 0)? 1: 2; 
} 

function isInsideLineWithTolerance(p, q, r, error){
    var deltaY1 = (p.y - q.y);
    var deltaX1 = (p.x - q.x);

    var deltaY2 = (p.y - r.y);
    var deltaX2 = (p.x - r.x);

    var value = deltaY1 * deltaX2 - deltaY2 * deltaX1;

    if(Math.abs(value) <= error){
        return true;
    }

    return false;
}

function doIntersect(p1, q1, p2, q2) 
{ 
    var o1 = pointOrientation(p1, q1, p2); 
    var o2 = pointOrientation(p1, q1, q2); 
    var o3 = pointOrientation(p2, q2, p1); 
    var o4 = pointOrientation(p2, q2, q1); 
 
    if (o1 != o2 && o3 != o4){
        return true; 
    }
        
 
    if (o1 == 0 && onSegment(p1, p2, q1)) {
        return true;
    } 
  
    if (o2 == 0 && onSegment(p1, q2, q1)) {
        return true;
    } 
 
    if (o3 == 0 && onSegment(p2, p1, q2)) {
        return true;
    } 
 
    if (o4 == 0 && onSegment(p2, q1, q2)) {
        return true;
    } 
 
    return false;  
} 

function isInside(polygon, p) 
{ 
    var n = polygon.length;

    if (n < 3) return false; 
    var INF = 10000;

    var extreme = {
        x: INF, 
        y: p.y
    }; 
    
    var count = 0, i = 0; 
    do
    { 
        var next = (i+1)%n; 
        var isIntersect = doIntersect(polygon[i], polygon[next], p, extreme)

        if (isIntersect) 
        { 
            
            if (pointOrientation(polygon[i], p, polygon[next]) == 0) {
                return onSegment(polygon[i], p, polygon[next]); 
            }
            console.log('intersect');
            count++; 
        } 
        i = next; 
    } while (i != 0); 
 
    return count%2 == 1; 
} 

function mapToPoint(polygon, count){
    var listOfPoint = [];
    for(var i=0; i<count; i += 1){
        listOfPoint.push({
            x: polygon[i*5],
            y: polygon[i*5 + 1]
        })
    }

    return listOfPoint
}

function mapToPointFilter(listOfItems, filter){
    var usedCount = 2;
    var modifiedItems = listOfItems.map((item, idx) => {
        return {
            ...item,
            index: idx
        }
    })
    var listOfFilter = modifiedItems.filter(item => item.type === filter)
    listOfFilter = listOfFilter.map(item => {
        if(item.count){
            usedCount = item.count;
        }
        return {
            type: item.type,
            points: mapToPoint(item.coordinates, usedCount),
            index: item.index
        }
    })

    return listOfFilter
}

function saveModel(name, items){
    console.log(items);
    var HTTP = new XMLHttpRequest();
    const url = "/server.php";

    var data = new FormData();
    data.append('items', JSON.stringify(items));
    data.append('name', name);

    HTTP.open("POST", url, true);
    HTTP.send(data);
}

function loadJSON(filename, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filename, true);
    xobj.onreadystatechange = function () {
        console.log('yes');
        if (xobj.readyState == 4 && xobj.status == "200") {
            console.log('yuhuu');
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);  
}