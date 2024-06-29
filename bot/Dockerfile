FROM golang:1.16-alpine

WORKDIR /bot

COPY . .

RUN go mod init bot
RUN go get -u github.com/go-telegram-bot-api/telegram-bot-api/v5
RUN go mod tidy
RUN go build -o /main

CMD ["/main"]
