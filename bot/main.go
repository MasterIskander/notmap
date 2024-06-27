package main

import (
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func main() {
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
