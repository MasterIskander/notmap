package main

import (
	"database/sql"
	"fmt"
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
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
	// Подключение к базе данных
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

	// Инициализация бота
	botToken := "7277152508:AAGPJuTo-F1288IJYBFdLmxsmm5WB-y6XTk"
	if botToken == "" {
		log.Fatal("TELEGRAM_BOT_TOKEN must be set")
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

		user := update.Message.From
		telegramTag := user.UserName

		// Сохранение пользователя в базе данных
		_, err := db.Exec("INSERT INTO users (telegram_tag) VALUES ($1) ON CONFLICT (telegram_tag) DO NOTHING", telegramTag)
		if err != nil {
			log.Printf("Failed to insert user: %v", err)
			continue
		}

		// Отправка сообщения с кнопкой для открытия веб-приложения
		webAppURL := "https://notmap.ru"
		webApp := tgbotapi.NewInlineKeyboardButtonURL("Open NotMap", webAppURL)
		row := tgbotapi.NewInlineKeyboardRow(webApp)
		markup := tgbotapi.NewInlineKeyboardMarkup(row)

		msg := tgbotapi.NewMessage(update.Message.Chat.ID, "Welcome to NotMap!\n\nA brief description of the game goes here.")
		msg.ReplyMarkup = markup

		if _, err := bot.Send(msg); err != nil {
			log.Printf("Failed to send message: %v", err)
		}
	}
}
