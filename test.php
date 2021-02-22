<?php ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body onload="main()">
    <div>
        <canvas id="c" width="800" height="600">
            Your browser does not support HTML5
        </canvas>
    </div>
    <div>
        <div class="feature">
            <input type="color" id="colorpicker" onchange="changeColor()" value="#ff0000" style="width:20%;">
        </div>
        <div class="feature">
            <button class="pure-button" id="drawline">Draw Line</button>
        </div>
        <div class="feature">
            <button class="pure-button" id="drawpoly">Draw Polygon</button>
        </div>
        <div class="feature">
            <input type="number" id="squaresize" name="squaresize" />
            <button class="pure-button" id="drawsquare">Draw Square</button>
        </div>
        <div class="feature">
            <input type="file" id="uploadModel"/>
        </div>
        <div class="feature">
            <button class="pure-button" id="save">Save Model</button>
            <input class="hide" type="text" id="inputName" placeholder="file name" />
            <button id="saveChanges" class="pure-button hide">Save</button>
        </div>
        <div>
            <span id="objectClicked"> Clicked : -</span>
        </div>
    </div>
    <script src="util.js"></script>
    <script src="webgl.js"></script>
</body>



</html>