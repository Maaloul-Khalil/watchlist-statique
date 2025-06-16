<?php
session_start();
require "connect.php";
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Index</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>


<body class="container-fluid">
    <div class="row mb-3">
    <div class="col-md-12 d-flex justify-content-between align-items-center">
        <h1 class="mb-0">Basic Dashboard</h1>
        <a class="btn btn-success" href="usersCrud/create.php">Create a new user</a>
    </div>
</div>


    <?php if (isset($_SESSION['msg'])): ?>
        <div class="alert alert-success" role="alert">
            <?= $_SESSION['msg'] ?>
        </div>
        <?php unset($_SESSION['msg']); ?>
    <?php endif; ?>

    <div class="row">
        <div class="col-12">
            <table class="table table-hover align-middle"  style="text-align: center;margin-right: -0.5rem">
                <thead class="table-dark">
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Verified Email</th>
                        <th colspan="3">Actions Utilisateur</th>
                        <th>PlaylistSize</th>
                        <th>PlaylistAction</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $result = $pdo->query("SELECT * FROM users");
                    $users = $result->fetchAll();
                    foreach ($users as $user):
                        $stmt = $pdo->prepare("SELECT count(*) FROM watch_items WHERE user_id = :user_id AND deleted_at IS NULL");
                        $stmt->bindValue(':user_id', $user['id'], PDO::PARAM_INT);
                        $stmt->execute();
                        $count = $stmt->fetchColumn();
                    ?>
                        <tr>
                            <td><?= htmlspecialchars($user['username']) ?></td>
                            <td><?= htmlspecialchars($user['email']) ?></td>
                            <td><?= $user['email_verified'] ? 'Yes' : 'No' ?></td>
                            <td>
                                <a href="usersCrud/show.php?id=<?= $user['id'] ?>" class="btn btn-primary btn-sm">Info</a>
                            </td>
                            <td>
                                <a href="usersCrud/edit.php?id=<?= $user['id'] ?>" class="btn btn-warning btn-sm">Modify</a>
                            </td>
                            <td>
                                <a href="usersCrud/delete.php?id=<?= $user['id'] ?>" class="btn btn-danger btn-sm"
                                   onclick="return confirm('Are you sure you want to delete this user?');">
                                   Delete
                                </a>
                            </td>
                            <td><?= $count ?></td>
                            <td>
                                <a href="showPlaylist.php?id=<?= $user['id'] ?>" class="btn btn-info btn-sm">See <?= htmlspecialchars($user['username']) ?> Playlist's</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>
