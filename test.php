<?php ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    *, html, body {
        margin: 0;
        padding: 0;
    }
    </style>
</head>
<body onload="main()">
    

    <canvas id="c" width="800" height="600">
        Your browser does not support HTML5
    </canvas>
    <div>
        <input type="color" id="colorpicker" onchange="changeColor()" value="#ff0000" style="width:20%;">
        
        <button id="drawline">draw line</button>
        <input type="number" id="squaresize" name="squaresize" />
        <button id="drawsquare">draw square</button>
        <button id="save">save model</button>
    </div>
    <script src="util.js"></script>
    <script src="webgl.js"></script>
</body>



</html>