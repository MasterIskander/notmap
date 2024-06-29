FROM golang:1.16-alpine

WORKDIR /bot

COPY . .

RUN go mod init bot
RUN go get -u github.com/go-telegram-bot-api/telegram-bot-api/v5
RUN go mod tidy
RUN go build -o /main

ENV TELEGRAM_BOT_TOKEN=7277152508:AAGPJuTo-F1288IJYBFdLmxsmm5WB-y6XTk

CMD ["/main"]
