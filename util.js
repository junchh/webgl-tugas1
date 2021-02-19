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

function saveModel(items){
    console.log(items);
    var HTTP = new XMLHttpRequest();
    const url = "/server.php";

    var data = new FormData();
    data.append('items', JSON.stringify(items));

    HTTP.open("POST", url, true);
    HTTP.send(data);
}