package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	connStr := "user=notmap_user password=your_password dbname=notmap sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/api/username", getUsername)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s...", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func getUsername(w http.ResponseWriter, r *http.Request) {
	telegramUser := r.URL.Query().Get("telegram_user")
	if telegramUser == "" {
		http.Error(w, "Missing telegram_user parameter", http.StatusBadRequest)
		return
	}

	var username string
	err := db.QueryRow("SELECT telegram_user FROM users WHERE telegram_user = $1", telegramUser).Scan(&username)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to query user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"username": username})
}
