<?php
require_once('connect.php');

function getPlaylistItems($pdo, $userId, $isFinished = false)
{
    $query = $isFinished
        ? 'SELECT * FROM watch_items WHERE user_id = :user_id AND deleted_at IS NOT NULL ORDER BY deleted_at DESC'
        : 'SELECT * FROM watch_items WHERE user_id = :user_id AND deleted_at IS NULL ORDER BY date_added DESC';
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

/**
 * Format date with relative time display
 */
function formatDateWithRelative($date, $isFinished = false)
{
    $dateTime = new DateTime($date);
    $now = new DateTime();
    $interval = $now->diff($dateTime);
    $daysDiff = $interval->days;
    $formattedDate = $dateTime->format('d/m/Y');
    if ($daysDiff == 0) {
        return 'Today';
    } elseif ($isFinished) {
        if ($daysDiff == 1) {
            return $formattedDate . ' (1 day ago)';
        } else {
            return $formattedDate . " ({$daysDiff} days ago)";
        }
    }
    return $formattedDate;
}

function renderPlaylistSection($title, $items, $isFinished = false)
{
    if (empty($items)) {
        $message = $isFinished ? "No finished videos." : "Empty Playlist.";
        $alertClass = $isFinished ? "secondary" : "info";
        echo "<div class='alert alert-$alertClass'>$message</div>";
        return;
    }
    $tableClass = $isFinished ? 'table-success' : 'table-striped';
    $dateHeader = $isFinished ? 'DateFinished' : 'DateAdded';
    echo "<h4 class='mt-5'>$title: ". count($items)." video(s)</h4>";
    echo "<div class='table-responsive'>
            <table style='text-align: center;' class='table table-hover align-middle $tableClass'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Creator</th>
                        <th>Platform</th>
                        <th>Rating</th>
                        <th>$dateHeader</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>";
    foreach ($items as $item) {
        $title = htmlspecialchars($item['title']);
        $url = htmlspecialchars($item['url']);
        $creator = !empty($item['creator']) ? htmlspecialchars($item['creator']) : 'unknown';
        $platform = !empty($item['platform']) ? htmlspecialchars($item['platform']) : 'unknown';
        $rating = htmlspecialchars($item['rating']);
        $dateField = $isFinished ? $item['deleted_at'] : $item['date_added'];
        $formattedDate = formatDateWithRelative($dateField, $isFinished);
        $comments = !empty($item['comments']) ? nl2br(htmlspecialchars($item['comments'])) : 'no comment';

        $itemId = htmlspecialchars($item['id']);
        $userId = htmlspecialchars($_GET['id']);
        echo "<tr>
            <td><a href='$url' target='_blank'>$title</a></td>
            <td>$creator</td><td>$platform</td><td>$rating/5</td><td>$formattedDate</td><td>$comments</td>
            <td>
            <a href='itemsCrud/deleteItem.php?id=$itemId&user_id=$userId' 
               class='btn btn-danger btn-sm' 
               onclick='return confirm(\"Confirm delete video?\");'>Delete</a>
            </td>
        </tr>";
    }
    echo "    </tbody>
          </table>
      </div>";
}

// Main logic
if (isset($_GET['id'])) {
    $userId = (int) $_GET['id'];

    // Get user
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->bindValue(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch();

    if (!$user) {
        $_SESSION['msg'] = "User not found.";
        header('Location: index.php');
        exit;
    }

    // Get playlist items
    $inProgressItems = getPlaylistItems($pdo, $userId, false);
    $finishedItems = getPlaylistItems($pdo, $userId, true);
} else {
    $_SESSION['msg'] = "URL invalid.";
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($user['username']) ?>'s Playlist </title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>

<body>
    <main class="container py-4">
        <div class="row mb-3 justify-content-between align-items-center">
            <div class="col-md-8">
                <h2><?= htmlspecialchars($user['username']) ?>'s Playlist catalog</h2>
                <a href="index.php" class="btn btn-secondary mb-3">Return</a>

            </div>
            <div class="col-md-4" style="text-align: center;">
                <a class="btn btn-success" href="itemsCrud/createItem.php?id=<?= $user['id'] ?>">add a new video</a>
            </div>
        </div>
        <h2></h2>
        <?php
        renderPlaylistSection("Current Playlist", $inProgressItems, false);
        renderPlaylistSection("Recently Finished videos", $finishedItems, true);
        ?>
    </main>
</body>

</html>