BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'notmap') THEN
      CREATE DATABASE notmap;
   END IF;
END

BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'notmap_user') THEN
      CREATE USER notmap_user WITH PASSWORD 'your_password';
      GRANT ALL PRIVILEGES ON DATABASE notmap TO notmap_user;
   END IF;
END

use notmap;

-- Скрипт создания таблиц
-- Создание таблицы users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_tag VARCHAR(255),
    name VARCHAR(255),
    image TEXT,
    score INTEGER,
    wallet VARCHAR(255)
);

-- Создание таблицы maps
CREATE TABLE maps (
    id SERIAL PRIMARY KEY,
    number_land INTEGER,
    field_wrap VARCHAR(255)
);

-- Создание таблицы lands
CREATE TABLE lands (
    id SERIAL PRIMARY KEY,
    coordinate VARCHAR(255),
    type VARCHAR(255),
    income INTEGER,
    name VARCHAR(255),
    color VARCHAR(255),
    user_own INTEGER[]
);
