<?php
define('SERVER', 'localhost');
define('DBNAME', 'watchlist');
define('USER', 'root');
define('PASSWD', '');

$dns = "mysql:host=".SERVER.";dbname=".DBNAME;

try {
    // Create a PDO object
    $pdo = new PDO($dns, USER, PASSWD);

    // Set error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Optional: Set character encoding
}
catch(PDOException $e) {
    $msg = 'Erreur ' . $e->getFile() . ' ligne ' . $e->getLine() . ' : ' . $e->getMessage();
    die($msg);
}
?>