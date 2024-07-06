FROM golang:1.16-alpine

WORKDIR /server

COPY . .

RUN go mod init server
RUN go get -u github.com/lib/pq
RUN go mod tidy
RUN go build -o server .

CMD ["./server"]
