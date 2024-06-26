FROM golang:1.16-alpine

WORKDIR /app

COPY . .

RUN go mod init bot
RUN go get -d -v ./...
RUN go build -o /main

CMD ["/main"]
