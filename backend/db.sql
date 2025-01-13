-- Créer la base de données
CREATE DATABASE IF NOT EXISTS quiz_db;

USE quiz_db;

-- Table des joueurs
CREATE TABLE users (
                       id VARCHAR(36) PRIMARY KEY,  -- UUID for players
                       name VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       link VARCHAR(255) NOT NULL,
                       score INT DEFAULT 0,
                       role ENUM('admin', 'player') DEFAULT 'player'
);

-- Table des questions
CREATE TABLE questions (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           question TEXT NOT NULL,
                           answers JSON NOT NULL,  -- Store answers as a JSON array
                           correct_answer INT NOT NULL
);

-- Table des réponses
CREATE TABLE responses (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           player_id VARCHAR(36) NOT NULL,  -- Reference to the user's id (UUID)
                           question_id INT NOT NULL,  -- Reference to the questions table
                           answer INT NOT NULL,
                           FOREIGN KEY (player_id) REFERENCES users(id),  -- Reference to the users table
                           FOREIGN KEY (question_id) REFERENCES questions(id)  -- Reference to the questions table
);

-- Insert sample questions into the questions table
INSERT INTO questions (question, answers, correct_answer) VALUES
                                                              ('Quelle est la capitale de la France ?', '["Paris", "Lyon", "Marseille", "Nice"]', 0),
                                                              ('Combien font 5 + 3 ?', '["5", "8", "7", "10"]', 1);
INSERT INTO users (id, name, password, link, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin', '$2b$10$HzQ7P2Xv8jpYZ37/EE4JE.0JlE3iYQFFtcPztSKAPl8K3Mlecjvnu', 'admin', 'admin');