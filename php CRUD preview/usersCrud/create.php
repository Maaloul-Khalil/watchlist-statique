<?php
session_start();
require_once "../connect.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add User</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container">
    <div class="h1">Add New User</div>
    <form action="" method="post">
        <div class="mb-3">
            <label for="name" class="form-label">Full Name:</label>
            <input type="text" class="form-control" name="name" id="name" required>
        </div>
        <div class="mb-3">
            <label for="username" class="form-label">Username:</label>
            <input type="text" class="form-control" name="username" id="username" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" name="email" id="email" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input type="password" class="form-control" name="password" id="password" required>
        </div>
        <input type="submit" value="Add User" class="btn btn-primary">
    </form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Hash the password
    $hashedPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $emailVerified = false;
    $createdAt = date('Y-m-d H:i:s');
    
    try {
        $sql = "INSERT INTO users (name, username, email, email_verified, password, created_at) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        
        // The order of parameters must match the order of columns in the SQL statement
        $res = $stmt->execute([
            $_POST['name'],
            $_POST['username'],
            $_POST['email'],
            $emailVerified,
            $hashedPassword,
            $createdAt
        ]);
        
        if($res) {
            $_SESSION['msg'] = "User added successfully";
            header("Location: ../index.php");
            exit;
        } else {
            echo "<div class='alert alert-danger'>Error adding user</div>";
        }
    } catch (PDOException $e) {
        echo "<div class='alert alert-danger'>Error: " . $e->getMessage() . "</div>";
    }
}
?>
</body>
</html>