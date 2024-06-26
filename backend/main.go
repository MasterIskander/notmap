package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    "os"
    _ "github.com/lib/pq"
)

const (
    host     = "db"
    port     = 5432
    user     = "notmap_user"
    password = "your_password"
    dbname   = "notmap"
)

func main() {
    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
        host, port, user, password, dbname)

    db, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    err = db.Ping()
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Successfully connected to database!")

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello from backend!")
    })

    log.Fatal(http.ListenAndServe(":8080", nil))
}
