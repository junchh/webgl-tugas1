var vertexShaderText = 
`
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main()
{
  fragColor = vertColor;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}`

var fragmentShaderText =
`
precision mediump float;

varying vec3 fragColor;
void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
}`

var clickedPolygonIndex = -1;

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

const transformClick = (ev) => {
    let nowX = ev.clientX 
    let nowY = ev.clientY

    nowX = (nowX - 360) / 360
    nowY = (-1 * (nowY - 360)) / 360 
    
    return {x: nowX, y: nowY}
}

let square_size = 0

const state = {
    type: 'none',
    payload: {}
}
const canvas = document.getElementById('c')
const gl = canvas.getContext('webgl')

const drawline = document.getElementById("drawline")
const drawsquare = document.getElementById("drawsquare")
const squaresize = document.getElementById("squaresize")
const colorpicker = document.getElementById("colorpicker")
const save = document.getElementById("save")

save.onclick = () => {
    saveModel(listOfItems)
}

squaresize.onchange = (ev) => {
    square_size = ev.target.value
}

drawline.onclick = () => {
    drawline.disabled = true

    state.type = 'drawline'

    state.payload = {current: 0, pivot: {}}
}

drawsquare.onclick = () => {
    drawsquare.disabled = true 

    state.type = 'drawsquare' 
}

colorpicker.onchange = () => {
    var colorCode = colorpicker.value;
    var rgb = hexToRgb(colorpicker.value);

    if(clickedPolygonIndex >= 0){
        for(var i=0;i < listOfItems[clickedPolygonIndex].count; i++){
            listOfItems[clickedPolygonIndex].coordinates[i*5 + 2] = rgb.r;
            listOfItems[clickedPolygonIndex].coordinates[i*5 + 3] = rgb.g;
            listOfItems[clickedPolygonIndex].coordinates[i*5 + 4] = rgb.b;
        }
    }
    render(gl, listOfItems)
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
            state.payload.current++
            state.payload.pivot = coordinate 
        } else {
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
            drawline.disabled = false
        }
    } else if(state.type == 'drawsquare') {
        const len = square_size / 400
        listOfItems.push({
            type: 'polygon',
            coordinates: [
                coordinate.x, coordinate.y, 0.0, 0.0, 0.0,
                coordinate.x + len, coordinate.y, 0.0, 0.0, 0.0,
                coordinate.x + len, coordinate.y - len, 0.0, 0.0, 0.0,
                coordinate.x, coordinate.y - len, 0.0, 0.0, 0.0
            ],
            count: 4

        })
        state.type = 'none'
        state.payload = {}
        drawsquare.disabled = false
    }else{
        console.log(listOfItems)
        // cek apakah berada di dalam suatu poligon
        var modifiedItems = listOfItems.map((item, idx) => {
            return {
                ...item,
                index: idx
            }
        })
        var listOfPolygons = modifiedItems.filter(item => item.type === 'polygon')
        listOfPolygons = listOfPolygons.map(item => {
            return {
                points: mapToPoint(item.coordinates, item.count),
                index: item.index
            }
        })
        console.log(listOfPolygons)
        var anyInside = false;
        listOfPolygons.forEach(polygon => {
            console.log(polygon.index);
            if(isInside(polygon.points, coordinate)){
                if(clickedPolygonIndex === polygon.index){
                    clickedPolygonIndex = -1;
                }else{
                    clickedPolygonIndex = polygon.index;
                }

                anyInside = true;
            }
        })

        if(!anyInside){
            clickedPolygonIndex = -1;
        }
        console.log(clickedPolygonIndex);
        state.type = 'none'

    }

    render(gl, listOfItems)
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

    render(gl, listOfItems)


}


