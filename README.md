# WatchLater Manager

Un petit site pour sauvegarder ses films à regarder plus tard. Simple et efficace.

## Comment ça marche

Remplissez le formulaire à gauche, votre film apparaît en carte à droite. Vous pouvez supprimer les cartes d'un clic. Tout est sauvegardé dans votre navigateur.

## Fonctionnalités

- Formulaire simple pour ajouter des films
- Affichage en cartes avec suppression facile
- Thème sombre/clair (.darktheme)
- Deux langues (français/anglais)
- Compteur de films dans le footer
- Données conservées même après fermeture

## Tech utilisée

- **HTML/CSS/JS** - Base classique
- **Bootstrap 5** - Pour le responsive
- **jQuery** - Manipulation DOM
- **localStorage** - Sauvegarde locale

## Structure

```
|   index.html / index-fr.html    # Les deux versions
+---css/                          # Styles (media tag)+ specialfont pour icons + Bootstrap
+---js/                           # Scripts + jQuery + Bootstrap
+---images/                       # Images du projet
```
## Test
![Gif](https://media.giphy.com/media/3DYAlkTiRJO19Hqz55/giphy.gif)


---

📧 **Contact :** maaloulmohamedkhalil@isimsf.u-sfax.tn

---

# Partie PHP - Dashboard Admin 

Un dashboard SEPARE où j'applique les fondamentaux de PHP PDO. Ce dashboard permettra à l'admin de gérer les utilisateurs et leurs listes de films.

## C'est quoi

Un CRUD basique avec deux tables : `users` et `watch_items`. Chaque user a sa propre liste de films.

## Fonctionnalités

- **Users** : Créer, voir, modifier, supprimer
### modifier user
![Gif](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmU3dDRwcTNoa2tjeXE2bG5oNXFmY2YwOW5mMnhpaWViYjh5OWZuMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XANJMhgWKyUqC42vyR/giphy.gif)
- **Films** : Ajouter/supprimer des films pour chaque user
### ajouter un video à un user
![Gif](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTk3eGlyOWloY3U3djh6YXJscG9ydzBzcjZ0dG5qeGgxOTBhc2NhayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sLvk6u8G5t8g6KMIjx/giphy.gif)

## Tech

- **PHP** avec **PDO** pour la DB
- **MySQL** 

## Base de données

```sql
-- Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    password VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Films
CREATE TABLE watch_items (
    id BIGINT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    url TEXT,
    creator VARCHAR(100),
    platform VARCHAR(50),
    rating TINYINT,
    comments TEXT,
    date_added DATETIME,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Structure PHP

```
php CRUD preview/
|   connect.php           # Connexion DB
|   index.php            # Dashboard principal
|   showPlaylist.php     # Liste des films
+---usersCrud/           # CRUD utilisateurs
+---itemsCrud/           # CRUD films
```


---
