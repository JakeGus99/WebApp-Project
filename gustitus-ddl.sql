CREATE SCHEMA IF NOT EXISTS project;
SET search_path TO project;

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50),
    wins INT,
    losses INT
);

INSERT INTO teams (name, city, wins, losses) VALUES
('Cowboys', 'Dallas', 5, 1),
('Eagles', 'Philadelphia', 4, 2),
('Giants', 'New York', 2, 4),
('Commanders', 'Washington', 1, 5);
