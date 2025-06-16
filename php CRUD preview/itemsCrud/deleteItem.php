<?php
require "../connect.php";

$item_id = $_GET['id'];
$user_id = $_GET['user_id'];

if ($item_id <= 0 || $user_id <= 0) {
    header("Location: ../showPlaylist.php?error=Invalid ID");
    exit();
}

$stmt = $pdo->prepare("DELETE FROM watch_items WHERE id = ? AND user_id = ?");
$stmt->execute([$item_id, $user_id]);

if ($stmt->rowCount() > 0) {
    header("Location: ../showPlaylist.php?id=$user_id");
}
exit();

