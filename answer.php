<?php

@session_start();
date_default_timezone_set('Europe/Moscow');
if (!isset($_SESSION["tableAnswer"])) $_SESSION["tableAnswer"] = array();
if (isset($_GET["x"])) {
    $x = $_GET["x"];
} else {
    http_response_code(403);
    exit(403);
}
$strY = $_GET["y"];
$y = substr($strY, 0, 6);
if (isset($_GET["r"])) {
    $r = $_GET["r"];
} else {
    http_response_code(403);
    exit(403);
}
if (checkData($x, $y, $r)) {
    $coordsStatus = checkCoordinates($x, $y, $r);
    if ($coordsStatus == "да") {
        $Status = "<td id=exactHit>";
        $Status .= $coordsStatus;
        $Status .= "</td>";
    } else {
        $Status = "<td id=missHit>";
        $Status .= $coordsStatus;
        $Status .= "</td>";
    }
    $currentTime = date("H:i:s");
    $benchmarkTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
    $benchmarkTime = round($benchmarkTime, 6) * 1e3;
    array_push($_SESSION["tableAnswer"], "<tr>
    <td>$x</td>
    <td>$y</td>
    <td>$r</td>
    $Status
    <td>$currentTime</td>
    <td>$benchmarkTime</td>
    </tr>");
    echo end($_SESSION['tableAnswer']);
} else {
    http_response_code(403);
    return;
}

function checkData($x, $y, $r)
{
    return  in_array($x, array(-3, -2, -1, 0, 1, 2, 3, 4, 5)) &&
        is_numeric($y) && ($y > -5 && $y < 5) &&
        in_array($r, array(1, 2, 3, 4, 5));
}

function checkCoordinates($x, $y, $r)
{
    if ((($x >= 0) && ($x <= $r / 2) && ($y >= 0) && ($y <= $r)) ||    // прямоугольник
        (($x >= 0) && ($y <= 0) && ($y >= $x * ($r / 2) - $r)) ||      // треугольник
        (($x ** 2 + $y ** 2) <= (($r ** 2)) && ($x <= 0) && ($y >= 0)) // четверть окружности
    ) return "да";
    else return "нет";
}
