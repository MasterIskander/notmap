DO
$$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'notmap_user') THEN
      CREATE ROLE notmap_user WITH LOGIN PASSWORD 'your_password';
   END IF;
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'notmap') THEN
      CREATE DATABASE notmap WITH OWNER notmap_user;
   END IF;
END
$$;

\c notmap;

-- Создание таблицы users, если она еще не существует
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_user VARCHAR(255) NOT NULL UNIQUE
);

-- Создание таблицы ton_addresses
CREATE TABLE IF NOT EXISTS ton_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ton_address VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Триггеры для обновления поля updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_ton_addresses_updated_at
BEFORE UPDATE ON ton_addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
