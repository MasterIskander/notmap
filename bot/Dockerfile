FROM golang:1.16-alpine

WORKDIR /bot

COPY . .

RUN go mod init bot
RUN go mod tidy
RUN go get -d -v ./...
RUN go build -o /main

CMD ["/main"]
