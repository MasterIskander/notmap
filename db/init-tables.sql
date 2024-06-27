\c notmap;

-- Скрипт создания таблиц
-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_tag VARCHAR(255),
    name VARCHAR(255),
    image TEXT,
    score INTEGER,
    wallet VARCHAR(255)
);

-- Создание таблицы maps
CREATE TABLE IF NOT EXISTS maps (
    id SERIAL PRIMARY KEY,
    number_land INTEGER,
    field_wrap VARCHAR(255)
);

-- Создание таблицы lands
CREATE TABLE IF NOT EXISTS lands (
    id SERIAL PRIMARY KEY,
    coordinate VARCHAR(255),
    type VARCHAR(255),
    income INTEGER,
    name VARCHAR(255),
    color VARCHAR(255),
    user_own INTEGER[]
);
