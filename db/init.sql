DO
$$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'notmap_user') THEN
      CREATE ROLE notmap_user WITH LOGIN PASSWORD 'your_password';
   END IF;
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'notmap') THEN
      CREATE DATABASE notmap WITH OWNER = notmap_user;
   END IF;
END
$$;

\c notmap;

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_user VARCHAR(255) NOT NULL UNIQUE
    ton_address TEXT
);
