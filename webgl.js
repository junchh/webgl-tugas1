var vertexShaderText = 
`
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

uniform mat4 u_scalingMatrix;

void main()
{
  fragColor = vertColor;
  gl_Position = u_scalingMatrix*vec4(vertPosition, 0.0, 1.0);
}`

var fragmentShaderText =
`
precision mediump float;

varying vec3 fragColor;
void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
}`

var clickedIndex = -1;

let listOfItems = [
    {
        type: 'point',
        coordinates: [
            0.0, 0.5, 0.0, 0.0, 0.0
        ]
    },
    {
        type: 'point',
        coordinates: [
            0.5, 0.5, 0.0, 0.0, 0.0
        ]
    },
    {
        type: 'line',
        coordinates: [
            0, 0, 0.0, 0.0, 0.0,
            0.3, 0.1, 0.0, 0.0, 0.0
        ]
    },
    {
        type: 'line',
        coordinates: [
            0.3, 0.1, 0.0, 0.0, 0.0,
            0.8, 0.5, 0.0, 0.0, 0.0
        ]
    },
    {
        type: 'polygon',
        coordinates: [
            -0.25, 0.25, 0.0, 0.0, 0.0,
            0.25, 0.25, 0.0, 0.0, 0.0,
            0.3, -0.2, 0.0, 0.0, 0.0,
            0.1, -0.5, 0.0, 0.0, 0.0,
            -0.25, -0.25, 0.0, 0.0, 0.0

        ],
        count: 5
    }
]

const render = (gl, objects) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    for(const obj of objects) {
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.coordinates), gl.STATIC_DRAW)
        
        if(obj.type == 'point') {
            gl.drawArrays(gl.POINTS, 0, 1)
        } else if(obj.type == 'line') {
            gl.drawArrays(gl.LINES, 0, 2)
        } else {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, obj.count)
        }
        
    }
}



let square_size = 0
let prevX = 0
let prevY = 0

const state = {
    type: 'none',
    payload: {}
}
const canvas = document.getElementById('c')
const gl = canvas.getContext('webgl')
const moveshapes = document.getElementById("moveshapes")
const drawline = document.getElementById("drawline")
const drawpoly = document.getElementById("drawpoly")
const drawsquare = document.getElementById("drawsquare")
const changesquare = document.getElementById("changesquare")
const squaresize = document.getElementById("squaresize")
const colorpicker = document.getElementById("colorpicker")
const scaling = document.getElementById("scaler");
const save = document.getElementById("save")
const uploadModel = document.getElementById("uploadModel")
const saveChanges = document.getElementById("saveChanges");
const inputName = document.getElementById("inputName");
const deleteShape = document.getElementById("delete");

const transformClick = (ev) => {
    let nowX = ev.clientX 
    let nowY = ev.clientY

    const canvasW = canvas.width 
    const canvasH = canvas.height

    nowX = (nowX - (canvasW / 2)) / (canvasW / 2)
    nowY = (-1 * (nowY - (canvasH / 2))) / (canvasH / 2)
    
    return {x: nowX, y: nowY}
}

deleteShape.onclick = () => {
    if(clickedIndex >= 0){
        listOfItems.splice(clickedIndex, 1);
        render(gl, listOfItems);
    }
}

save.onclick = () => {
    save.classList.add('hide');
    saveChanges.classList.remove('hide');
    inputName.classList.remove('hide');
    // saveModel(listOfItems);
}

saveChanges.onclick = () => {
    save.classList.remove('hide');
    saveChanges.classList.add('hide');
    inputName.classList.add('hide');

    var name = "model";
    if(inputName.value !== ''){
        console.log('override');
        name = inputName.value;
        inputName.value = "";
    }
    saveModel(name, listOfItems);
}


squaresize.onchange = (ev) => {
    square_size = ev.target.value
}

drawline.onclick = () => {
    if(state.type == 'none') {
        drawline.innerHTML = "Stop Drawing Line"
        drawpoly.disabled = true 
        drawsquare.disabled = true

        state.type = 'drawline'

        state.payload = {current: 0, pivot: {}}
    } else if(state.type == 'drawline') {
        drawline.innerHTML = "Draw Line"
        drawpoly.disabled = false
        drawsquare.disabled = false 

        state.type = 'none' 

        state.payload = {}
    }
}

drawpoly.onclick = () => {
    if(state.type == 'none') {
        drawline.disabled = true
        drawsquare.disabled = true
        state.type = 'drawpoly'

        state.payload = {current: 0}

        drawpoly.innerHTML = "Stop Drawing Polygon"
    } else if(state.type == 'drawpoly') {
        drawpoly.innerHTML = "Draw Polygon"

        drawline.disabled = false
        drawsquare.disabled = false

        state.type = 'none'
        state.payload = {}
    }
    

}

drawsquare.onclick = () => {
    drawline.disabled = true
    drawpoly.disabled = true 
    drawsquare.disabled = true

    state.type = 'drawsquare' 
}

changesquare.onclick = () => {
    if(clickedIndex != -1) {
        const poly = listOfItems[clickedIndex] 
        if(poly.type == 'polygon' && poly.count == 4) {
            const canvasW = canvas.width / 2
            const canvasH = canvas.height / 2

            const lenx = square_size / canvasW
            const leny = square_size / canvasH
            const xawal = poly.coordinates[0]
            const yawal = poly.coordinates[1] 

            poly.coordinates[5] = xawal + lenx 
            poly.coordinates[10] = xawal + lenx 
            poly.coordinates[11] = yawal - leny 
            poly.coordinates[16] = yawal - leny

            listOfItems[clickedIndex] = poly 

            render(gl, listOfItems)
        }
    }
}

colorpicker.onchange = () => {
    var colorCode = colorpicker.value;
    var rgb = hexToRgb(colorpicker.value);

    var usedCount = 2;
    if(listOfItems[clickedIndex].count){
        usedCount = listOfItems[clickedIndex].count;
    }
    if(clickedIndex >= 0){
        for(var i=0;i < usedCount; i++){
            listOfItems[clickedIndex].coordinates[i*5 + 2] = rgb.r;
            listOfItems[clickedIndex].coordinates[i*5 + 3] = rgb.g;
            listOfItems[clickedIndex].coordinates[i*5 + 4] = rgb.b;
        }
    }
    render(gl, listOfItems)
}

scaling.oninput = () => {
    if (scaling.value >= 0){
        main();
    }
}
uploadModel.onchange = (e) => {
    console.log(e.target.files[0]);
    loadJSON(e.target.files[0].name, (json) => {
        listOfItems = json;
        render(gl, listOfItems);
    })
}

canvas.onmouseup = (ev) => {
    const coordinate = transformClick(ev) 

    if(state.type == 'drawline') {
        if(state.payload.current == 0) {

            listOfItems.push({
                type: 'point',
                coordinates: [
                    coordinate.x, coordinate.y, 0.0, 0.0, 0.0
                ]
            })
            state.payload.current = 1
            state.payload.pivot = coordinate 
        } else if(state.payload.current == 1){
            console.log("hehehekokmasuk")
            listOfItems.pop()
            listOfItems.push({
                type: 'line',
                coordinates: [
                    state.payload.pivot.x, state.payload.pivot.y, 0.0, 0.0, 0.0,
                    coordinate.x, coordinate.y, 0.0, 0.0, 0.0
                ]

            })
            state.type = 'none'
            state.payload = {}
            drawline.innerHTML = "Draw Line"
            drawpoly.disabled = false 
            drawsquare.disabled = false
        }
    } else if(state.type == 'drawsquare') {

        const canvasW = canvas.width / 2
        const canvasH = canvas.height / 2

        const lenx = square_size / canvasW
        const leny = square_size / canvasH
        listOfItems.push({
            type: 'polygon',
            coordinates: [
                coordinate.x, coordinate.y, 0.0, 0.0, 0.0,
                coordinate.x + lenx, coordinate.y, 0.0, 0.0, 0.0,
                coordinate.x + lenx, coordinate.y - leny, 0.0, 0.0, 0.0,
                coordinate.x, coordinate.y - leny, 0.0, 0.0, 0.0
            ],
            count: 4

        })
        state.type = 'none'
        state.payload = {}
        drawline.disabled = false
        drawpoly.disabled = false 
        drawsquare.disabled = false
    } else if(state.type == 'drawpoly') {
        if(state.payload.current == 0) {
            console.log("heheyy")
            listOfItems.push({
                type: 'point',
                coordinates: [
                    coordinate.x, coordinate.y, 0.0, 0.0, 0.0,
                ],
                count: 1
            })
            state.payload.current++
        } else if(state.payload.current == 1){

            const la = listOfItems[listOfItems.length - 1]

            la.type = 'line'
            la.count++
            la.coordinates.push(coordinate.x)
            la.coordinates.push(coordinate.y)
            la.coordinates.push(0.0)
            la.coordinates.push(0.0)
            la.coordinates.push(0.0)

            listOfItems.pop()
            listOfItems.push(la)

            state.payload.current++
        
        }else{
            console.log("lanjut")
            const la = listOfItems[listOfItems.length - 1]

            la.type = 'polygon'
            la.count++
            la.coordinates.push(coordinate.x)
            la.coordinates.push(coordinate.y)
            la.coordinates.push(0.0)
            la.coordinates.push(0.0)
            la.coordinates.push(0.0)

            listOfItems.pop()
            listOfItems.push(la)

            state.payload.current

        }

    } else if(state.type == 'drag') {
        state.type = 'none'
        state.payload = {}

        drawline.disabled = false
        scaling.disabled = false 
        drawpoly.disabled = false 
        drawsquare.disabled = false
        moveshapes.disabled = false
    
    } else {
        var listOfLine = mapToPointFilter(listOfItems, 'line')
        var anyInsideLine = false;
        listOfLine.forEach(line => {
            console.log(line.index)
            if(isInsideLineWithTolerance(line.points[0], line.points[1], coordinate, 0.01)){
                if(clickedIndex === line.index){
                    clickedIndex = -1;
                }else{
                    clickedIndex = line.index;
                    type = line.type;
                }

                anyInsideLine = true;
            }
        })

        console.log(listOfItems)
        // cek apakah berada di dalam suatu poligon
        var listOfPolygons = mapToPointFilter(listOfItems, 'polygon')
        console.log(listOfPolygons)
        var anyInsidePolygon = false;
        var type = "";
        listOfPolygons.forEach(polygon => {
            console.log(polygon.index);
            if(isInside(polygon.points, coordinate)){
                if(clickedIndex === polygon.index){
                    clickedIndex = -1;
                }else{
                    clickedIndex = polygon.index;
                    type = polygon.type;
                }

                anyInsidePolygon = true;
            }
        })

        const objectClicked = document.getElementById('objectClicked');

        if(!anyInsidePolygon && !anyInsideLine){
            clickedIndex = -1;
        }

        if(clickedIndex === -1){
            objectClicked.innerHTML = "Clicked : -";
        }else{
            objectClicked.innerHTML = "Clicked : " + type + " " + clickedIndex;
        }
        
        console.log(clickedIndex);
        state.type = 'none'

    }

    render(gl, listOfItems)
}

canvas.onmousedown = (ev) => {
    const coordinate = transformClick(ev) 
    if(state.type == 'drag') {
        var listOfLine = mapToPointFilter(listOfItems, 'line')
        var anyInsideLine = false;
        listOfLine.forEach(line => {
            console.log(line.index)
            if(isInsideLineWithTolerance(line.points[0], line.points[1], coordinate, 0.01)){
                if(clickedIndex === line.index){
                    clickedIndex = -1;
                }else{
                    clickedIndex = line.index;
                    type = line.type;
                }

                anyInsideLine = true;
            }
        })

        console.log(listOfItems)
        // cek apakah berada di dalam suatu poligon
        var listOfPolygons = mapToPointFilter(listOfItems, 'polygon')
        console.log(listOfPolygons)
        var anyInsidePolygon = false;
        var type = "";
        listOfPolygons.forEach(polygon => {
            console.log(polygon.index);
            if(isInside(polygon.points, coordinate)){
                if(clickedIndex === polygon.index){
                    clickedIndex = -1;
                }else{
                    clickedIndex = polygon.index;
                    type = polygon.type;
                }

                anyInsidePolygon = true;
            }
        })

        const objectClicked = document.getElementById('objectClicked');

        if(!anyInsidePolygon && !anyInsideLine){
            clickedIndex = -1;
        } else {
            console.log("dalammm")
            state.payload = {id: clickedIndex}
            console.log("garis ini ")
            console.log(clickedIndex)
            prevX = coordinate.x 
            prevY = coordinate.y
        }
    }
}

canvas.onmousemove = (ev) => {
    if(state.type == 'drag') {
        const coordinate = transformClick(ev) 

        console.log("sekarang x: " + coordinate.x)
        console.log("sekarang y: " + coordinate.y)

        const poly = listOfItems[state.payload.id] 

        if(poly.type == 'polygon') {
            for(let i = 0; i < 5 * poly.count; i++) {
                if(i % 5 == 0) {
                    poly.coordinates[i] += coordinate.x - prevX
                } else if(i % 5 == 1) {
                    poly.coordinates[i] += coordinate.y - prevY
                }
            }
        } else {
            for(let i = 0; i < 5 * 2; i++) {
                if(i % 5 == 0) {
                    poly.coordinates[i] += coordinate.x - prevX
                } else if(i % 5 == 1) {
                    poly.coordinates[i] += coordinate.y - prevY
                }
            }
        }

        listOfItems[state.payload.id] = poly

        console.log("popop")
        console.log(poly)

        prevX = coordinate.x 
        prevY = coordinate.y

        render(gl, listOfItems)
    }
}

moveshapes.onclick = (ev) => {
    if(state.type == 'none') {
        state.type = 'drag'
        moveshapes.disabled = true
        drawline.disabled = true 
        drawpoly.disabled = true 
        drawsquare.disabled = true 
        scaling.disabled = true 
    }
}




var main = function () {
	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl')
		gl = canvas.getContext('experimental-webgl')
	}

	if (!gl) {
		alert('Your browser does not support WebGL')
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER)
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

	gl.shaderSource(vertexShader, vertexShaderText)
	gl.shaderSource(fragmentShader, fragmentShaderText)

	gl.compileShader(vertexShader)
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
		return
	}

	gl.compileShader(fragmentShader)
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
		return
	}

	var program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program))
		return
	}
	gl.validateProgram(program)
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program))
		return
	}



	var buffObject = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffObject)
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor')
	gl.vertexAttribPointer(
		positionAttribLocation,
		2,
		gl.FLOAT, 
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, 
		0 
	)
	gl.vertexAttribPointer(
		colorAttribLocation, 
		3, 
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		2 * Float32Array.BYTES_PER_ELEMENT 
	)

	gl.enableVertexAttribArray(positionAttribLocation)
	gl.enableVertexAttribArray(colorAttribLocation)


	gl.useProgram(program)

    // Scaling
    Sx = document.getElementById("scaler").value;
    Sy = document.getElementById("scaler").value;
    Sz = 1.0;
    var scalingMatrix = new Float32Array([
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0, 1.0
        ]);
    var scaledMatrix = gl.getUniformLocation(program, 'u_scalingMatrix');
    gl.uniformMatrix4fv(scaledMatrix, false, scalingMatrix);

    render(gl, listOfItems)


}


