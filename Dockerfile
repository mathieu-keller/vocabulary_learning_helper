FROM node:14-alpine AS NodeBuilder
WORKDIR /app
COPY src/frontend .
RUN yarn install --network-timeout 60000
RUN npm run build:prod

FROM golang:1.14-alpine AS GOBuilder
WORKDIR $GOPATH/src/github.com/afrima/japanese_learning_helper/src/backend
COPY src/backend .
RUN apk update && apk add --no-cache git
RUN go get -d -v
RUN go build -ldflags "-s -w" -o /go/bin/backend

FROM alpine:latest
LABEL maintainer=MathieuKeller@gmx.de
WORKDIR /app
COPY --from=GOBuilder /go/bin/backend .
COPY --from=NodeBuilder /app/dist ./dist
EXPOSE 80:80
ENTRYPOINT ["/app/backend"]
