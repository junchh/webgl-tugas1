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
        <div class="editing">
            <div>
                <canvas id="c" width="800" height="600">
                    Your browser does not support HTML5
                </canvas>
            </div>
            <div>
                <div class="feature">
                    <button class="pure-button" id="moveshapes">Move Shapes</button>
                </div>
                <div class="feature">
                    <input type="color" id="colorpicker" onchange="changeColor()" value="#ff0000" style="width:20%;">
                </div>
                <div class="feature">
                    Scale: <input type="number" id="scaler" value=1 style="width:20%" min=0>
                </div>
                <div class="feature">
                    <button class="pure-button" id="drawline">Draw Line</button>
                </div>
                <div class="feature">
                    <input type="number" id="linesize" name="linesize" />
                    <button class="pure-button" id="changeline">Change Line</button>
                </div>
                <div class="feature">
                    <button class="pure-button" id="drawpoly">Draw Polygon</button>
                </div>
                <div class="feature">
                    <input type="number" id="squaresize" name="squaresize" />
                    <button class="pure-button" id="drawsquare">Draw Square</button>
                </div>
                <div class="feature">
                    <button class="pure-button" id="changesquare">Change Square</button>
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
                <div>
                    <button class="pure-button" id="delete"> Delete Shape</span>
                </div>
            </div>
        </div>
        <div class="help" id="help">
            <div>
                <span class="help-feature">Draw Line</span>
                <div class="step">
                    1. Klik button "Draw Line"
                </div>
                <div class="step">
                    2. Klik titik pertama di area canvas sebagai salah satu titik ujung line.
                </div>
                <div class="step">
                    3. Klik titik kedua di area canvas untuk membentuk line.
                </div>
                <div class="step">
                    <span>Catatan:</span> Jika user ingin membatalkan pembuatan line dapat klik button "Stop Drawing Line"
                </div>
            </div>
            <div>
                <span class="help-feature">Change Line</span>
                <div class="step">
                    1. Isi ukuran untuk line yang baru.
                </div>
                <div class="step">
                    2. Klik line yang ingin diubah.
                </div>
                <div class="step">
                    3. klik change line.
                </div>
            </div>
            <div>
                <span class="help-feature">Draw Polygon</span>
                <div class="step">
                    1. Klik button "Draw Polygon"
                </div>
                <div class="step">
                    2. Klik titik pertama di area canvas sebagai salah satu titik yang membentuk polygon.
                </div>
                <div class="step">
                    3. Klik titik berikutnya yang akan membentuk polygon pada canvas.
                </div>
                <div class="step">
                    4. Jika dirasa sudah selesai membentuk polygon yang diinginkan, dapat klik button "Stop Drawing Polygon"
                </div>
                <div class="step">
                    <span>Catatan:</span> Jika user ingin membatalkan pembuatan polygon dapat klik button "Stop Drawing Polygon"
                </div>
            </div>
            <div>
                <span class="help-feature">Draw Square</span>
                <div class="step">
                    1. Isi ukuran untuk square yang akan dibentuk pada text field.
                </div>
                <div class="step">
                    2. Klik button "Draw Square"
                </div>
                <div class="step">
                    3. Klik titik pertama di area canvas sebagai salah satu titik ujung pembentukan polygon.
                </div>
                <div class="step">
                    <span>Catatan:</span> Jika user ingin membatalkan pembuatan square dapat klik button "Stop Drawing Square"
                </div>
            </div>
            <div>
                <span class="help-feature">Change Square</span>
                <div class="step">
                    1. Isi ukuran untuk square yang baru.
                </div>
                <div class="step">
                    2. Klik square yang ingin diubah.
                </div>
                <div class="step">
                    3. klik change square.
                </div>
            </div>
            <div>
                <span class="help-feature">Load Model</span>
                <div class="step">
                    1. Siapkan file model dalam ekstensi ".json".
                </div>
                <div class="step">
                    2. Letakkan file model pada root directory project.
                </div>
                <div class="step">
                    3. Pilih file dengan membuka "Choose file" dialog.
                </div>
                <div class="step">
                    <span>Catatan:</span> Jika user ingin mengganti model lagi melalui file model, pastikan nama file berbeda dengan file sebelumnya.
                </div>
            </div>
            <div>
                <span class="help-feature">Save Model</span>
                <div class="step">
                    1. Klik button "Save Model"
                </div>
                <div class="step">
                    2. Beri nama file model, dan akan secara otomatis menambah ekstensi ".json" ketika di-save.
                </div>
                <div class="step">
                    3. Klik button "Save"
                </div>
                <div class="step">
                    <span>Catatan:</span> Secara default model akan di save dengan nama "model.json"
                </div>
            </div>
            <div>
                <span class="help-feature">Change Color</span>
                <div class="step">
                    1. Klik objek yang terdapat pada canvas.
                </div>
                <div class="step">
                    2. Pilih warna pada color picker.
                </div>
                <div class="step">
                    3. Tutup color picker, atau klik sembarang pada halaman website.
                </div>
            </div>
            <div>
                <span class="help-feature">Move Shape</span>
                <div class="step">
                    1. Klik button "Move Shape"
                </div>
                <div class="step">
                    2. Klik dan drag objek yang ingin dipindahkan.
                </div>
            </div>
        </div>
        <script src="util.js"></script>
        <script src="webgl.js"></script>
        
    </body>
</html>