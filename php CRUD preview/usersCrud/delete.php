<?php session_start();
require "../connect.php";
if (isset($_GET["id"])) {
    $sql = "delete FROM users WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $_GET["id"]);
    $row = $stmt->execute();
    if ($row > 0) {
        $_SESSION["msg"] = "user deleted successfully";
        header("Location: ../index.php");
    }
} else {
    echo "wrong id";
}
?>
