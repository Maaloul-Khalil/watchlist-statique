<?php
session_start();
require_once('../connect.php');
if(!isset($_GET['id'])) {
    echo "<div class='alert alert-danger'}>Invalid user ID.</div>";
    exit;
}
$userId = $_GET['id'] ;
try {
    // Fetch user info
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo "<div class='alert alert-danger'>User not found.</div>";
        exit;
    }

    $username = htmlspecialchars($user['username']);

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $title = $_POST['title'];
        $url = $_POST['url'];
        $creator = $_POST['creator'];
        $platform = $_POST['platform'];
        $rating = $_POST['rating'];
        $comments = $_POST['comments'];
        $dateAdded = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO watch_items (user_id, title, url, creator, platform, rating, comments, date_added)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $res = $stmt->execute([
            $userId,
            $title,
            $url,
            $creator,
            $platform,
            $rating,
            $comments,
            $dateAdded
        ]);

        if ($res) {
            $_SESSION['msg'] = "Watch item added successfully.";
            header("Location: ../showPlaylist.php?id=" . $userId);
            exit;
        } else {
            echo "<div class='alert alert-danger'>Error adding watch item.</div>";
        }
    }

} catch (PDOException $e) {
    echo "<div class='alert alert-danger'>Error: " . htmlspecialchars($e->getMessage()) . "</div>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Watch Item to <?= $username ?>'s Playlist</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<main class="container py-4">
    <h2 class="mb-4">Add Watch Item to <?= $username ?>'s Playlist</h2>

    <form method="POST">
        <div class="form-group">
            <label for="title">Title</label>
            <input required type="text" name="title" id="title" class="form-control">
        </div>

        <div class="form-group">
            <label for="url">Video URL</label>
            <input type="url" name="url" id="url" class="form-control">
        </div>

        <div class="form-group">
            <label for="creator">Creator</label>
            <input type="text" name="creator" id="creator" class="form-control">
        </div>

        <div class="form-group">
            <label for="platform">Platform</label>
            <input type="text" name="platform" id="platform" class="form-control">
        </div>

        <div class="form-group">
            <label for="rating">Rating (1–5)</label>
            <input type="number" name="rating" id="rating" class="form-control" min="1" max="5">
        </div>

        <div class="form-group">
            <label for="comments">Comments</label>
            <textarea name="comments" id="comments" class="form-control"></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Add Watch Item</button>
        <a href="../showPlaylist.php?id=<?= $userId ?>" class="btn btn-secondary">Cancel</a>
    </form>
</main>
</body>
</html>
