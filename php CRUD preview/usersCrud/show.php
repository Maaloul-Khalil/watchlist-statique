<?php
// show.php
session_start();
require_once('../connect.php');

// Validation of the user ID from GET
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $sql = 'SELECT * FROM users WHERE id = :id';
    $query = $pdo->prepare($sql);
    $query->bindValue(':id', $_GET['id'], PDO::PARAM_INT);
    $query->execute();
    $user = $query->fetch();

    if (!$user) {
        $_SESSION['msg'] = "Utilisateur non trouvé.";
        header('Location: ../index.php');
        exit;
    }
} else {
    $_SESSION['msg'] = "URL invalide.";
    header('Location: ../index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<main class="container py-4">
    <div class="row">
        <section class="col-12">
            <h2>User Details</h2>

            <p><strong>Name  :</strong> <?= htmlspecialchars($user['name']) ?></p>
            <p><strong>Username :</strong> <?= htmlspecialchars($user['username']) ?></p>
            <p><strong>Email :</strong> <?= htmlspecialchars($user['email']) ?></p>
            <p><strong>Email verified :</strong> <?= $user['email_verified'] ? 'Yes' : 'No' ?></p>



            <div class="d-flex gap-2">
                <a href="../index.php" class="btn btn-primary">Go back</a>
                <a href="edit.php?id=<?= $user['id'] ?>" class="btn btn-warning">Modify</a>
            </div>
        </section>
    </div>



</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
