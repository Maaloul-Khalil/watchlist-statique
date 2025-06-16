<?php
session_start();
require_once('../connect.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['new_password']) && isset($_POST['confirm_password'])) {
        $userId = $_POST['user_id'];
        $newPassword = $_POST['new_password'];
        $confirmPassword = $_POST['confirm_password'];

        // Basic validation
        if (empty($userId) || empty($newPassword) || empty($confirmPassword)) {
            $_SESSION['msg'] = "Tous les champs sont obligatoires.";
            header("Location: show.php?id=" . urlencode($userId));
            exit;
        }

        if ($newPassword !== $confirmPassword) {
            $_SESSION['msg'] = "Les mots de passe ne correspondent pas.";
            header("Location: show.php?id=" . urlencode($userId));
            exit;
        }

        // Hash and update
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $sql = "UPDATE users SET password = :password WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':password', $hashedPassword);
        $stmt->bindValue(':id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $_SESSION['msg'] = "Mot de passe réinitialisé avec succès.";
        header("Location: show.php?id=" . urlencode($userId));
        exit;

    } else {
        $_SESSION['msg'] = "Formulaire incomplet.";
        header("Location: ../index.php");
        exit;
    }
} else {
    $_SESSION['msg'] = "Accès non autorisé.";
    header("Location: ../index.php");
    exit;
}
