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
    ID            int    `json:"id"`
    TelegramUser  string `json:"telegram_user"`
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
    err := db.QueryRow("SELECT id, telegram_user FROM users WHERE telegram_user = $1", telegramUser).Scan(&user.ID, &user.TelegramUser)
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