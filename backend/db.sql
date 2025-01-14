-- Créer la base de données
CREATE DATABASE IF NOT EXISTS quiz_db;

USE quiz_db;

CREATE TABLE users (
                       id VARCHAR(36) PRIMARY KEY,
                       name VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       link VARCHAR(255) NOT NULL,
                       score INT DEFAULT 0,
                       role ENUM('admin', 'player') DEFAULT 'player'
);


CREATE TABLE questions (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           type ENUM('song', 'qcm', 'question') NOT NULL,
                           question TEXT,
                           options JSON,
                           correct_answer TEXT,
                           metadata JSON DEFAULT NULL
);

CREATE TABLE responses (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           player_id VARCHAR(36) NOT NULL,
                           question_id INT NOT NULL,
                           answer TEXT NOT NULL,
                           FOREIGN KEY (player_id) REFERENCES users(id),
                           FOREIGN KEY (question_id) REFERENCES questions(id)
);

INSERT INTO questions (type, question, options, correct_answer) VALUES
    ('qcm', 'Quelle est la capitale de la France ?', '["Paris", "Lyon", "Marseille", "Nice"]', '0');

-- ! Creation of an admin user
INSERT INTO users (id, name, password, link, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin', '$2b$10$HzQ7P2Xv8jpYZ37/EE4JE.0JlE3iYQFFtcPztSKAPl8K3Mlecjvnu', 'admin', 'admin');