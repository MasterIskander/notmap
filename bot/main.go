package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"os"

	tgbotapi "github.com/matterbridge/telegram-bot-api/v6"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")

    connStr := "host=" + dbHost + " port=" + dbPort + " user=" + dbUser + " password=" + dbPassword + " dbname=" + dbName + " sslmode=disable"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

	// Инициализация бота
	botToken := os.Getenv("TELEGRAM_BOT_TOKEN")
	if botToken == "" {
		log.Fatal("TELEGRAM_BOT_TOKEN must be set")
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	bot, err := tgbotapi.NewBotAPI(botToken)
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = true
	log.Printf("Authorized on account %s", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message == nil { // ignore any non-Message updates
			continue
		}

		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)

		if update.Message.Text == "/start" {
			username := update.Message.From.UserName
			var exists bool
			err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE telegram_user=$1)", username).Scan(&exists)
			if err != nil {
				log.Printf("Failed to check user existence: %v", err)
			}

			// Если пользователя нет, добавляем его
			if !exists {
				_, err = db.Exec("INSERT INTO users (telegram_user) VALUES ($1)", username)
				if err != nil {
					log.Printf("Failed to insert user: %v", err)
				}
			}

			

			webAppURL := fmt.Sprintf("https://notmap.ru?username=%s", url.QueryEscape(username))
			webAppInfo := tgbotapi.WebAppInfo{URL: webAppURL}
			webAppButton := tgbotapi.NewInlineKeyboardButtonWebApp("Запустить приложение", webAppInfo)

			row := tgbotapi.NewInlineKeyboardRow(webAppButton)
			markup := tgbotapi.NewInlineKeyboardMarkup(row)

			msg := tgbotapi.NewMessage(update.Message.Chat.ID, "Welcome to NotMap!\n\nA brief description of the game goes here.")
			msg.ReplyMarkup = markup

			if _, err := bot.Send(msg); err != nil {
				log.Printf("Failed to send message: %v", err)
			}
		}
	}
}
