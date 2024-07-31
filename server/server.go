package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"

    _ "github.com/lib/pq"
)

type User struct {
    ID           int    `json:"id"`
    TelegramUser string `json:"telegram_user"`
    TonAddress   string `json:"ton_address"`
}

var db *sql.DB

func main() {
    var err error
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")

    connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        dbHost, dbPort, dbUser, dbPassword, dbName)

    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }

    http.HandleFunc("/api/username", getUsername)
    http.HandleFunc("/api/connect_ton_wallet", connectTonWallet)
    log.Println("Server starting on port 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func getUsername(w http.ResponseWriter, r *http.Request) {
    telegramUser := r.URL.Query().Get("telegram_user")
    if telegramUser == "" {
        http.Error(w, "Missing telegram_user parameter", http.StatusBadRequest)
        return
    }

    var user User
    err := db.QueryRow("SELECT id, telegram_user, ton_address FROM users WHERE telegram_user = $1", telegramUser).Scan(&user.ID, &user.TelegramUser, &user.TonAddress)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "User not found", http.StatusNotFound)
        } else {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func connectTonWallet(w http.ResponseWriter, r *http.Request) {
    var requestData struct {
        TelegramUser string `json:"telegram_user"`
        TonAddress   string `json:"ton_address"`
    }

    if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    // Проверка, используется ли уже адрес другим пользователем
    var existingUserID int
    err := db.QueryRow("SELECT id FROM users WHERE ton_address = $1 AND telegram_user != $2", requestData.TonAddress, requestData.TelegramUser).Scan(&existingUserID)
    if err == nil {
        http.Error(w, "TON address already in use", http.StatusConflict)
        return
    } else if err != sql.ErrNoRows {
        http.Error(w, "Database error", http.StatusInternalServerError)
        return
    }

    // Проверка, является ли адрес уже сохраненным для этого пользователя
    var user User
    err = db.QueryRow("SELECT id, telegram_user, ton_address FROM users WHERE telegram_user = $1", requestData.TelegramUser).Scan(&user.ID, &user.TelegramUser, &user.TonAddress)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    if user.TonAddress == requestData.TonAddress {
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]bool{"success": true})
        return
    }

    // Обновление адреса для пользователя
    _, err = db.Exec("UPDATE users SET ton_address = $1 WHERE telegram_user = $2", requestData.TonAddress, requestData.TelegramUser)
    if err != nil {
        http.Error(w, "Failed to update TON address", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
