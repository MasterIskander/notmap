FROM golang:1.16-alpine

WORKDIR /bot

COPY . .

RUN go mod init bot
RUN go mod tidy
RUN go get -d -v ./...
RUN go build -o /main

COPY wait-for-it.sh /wait-for-it.sh
CMD ["/wait-for-it.sh", "db:5432", "/main"]
