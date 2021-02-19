<?php
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $items = $_POST["items"];
        
        // $items = array("Red", "Green", "Blue", "Orange", "Yellow");
        $message = "PHP Running";
        file_put_contents('model.json', $items);
    }
?>