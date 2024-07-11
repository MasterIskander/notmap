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

var db *sql.DB

type Response struct {
    Username string `json:"username"`
}

func main() {
    var err error

    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")

    psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        dbHost, dbPort, dbUser, dbPassword, dbName)

    db, err = sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatalf("Error opening database: %q", err)
    }

    defer db.Close()

    err = db.Ping()
    if err != nil {
        log.Fatalf("Error connecting to the database: %q", err)
    }

    log.Println("Successfully connected to the database")

    http.HandleFunc("/api/username", usernameHandler)
    log.Println("Server starting on port 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func usernameHandler(w http.ResponseWriter, r *http.Request) {
    telegramUser := r.URL.Query().Get("telegram_user")
    if telegramUser == "" {
        http.Error(w, "telegram_user is required", http.StatusBadRequest)
        return
    }

    var username string
    err := db.QueryRow("SELECT telegram_user FROM users WHERE telegram_user = $1", telegramUser).Scan(&username)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    response := Response{Username: username}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
