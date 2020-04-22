FROM golang:1.14-alpine AS GOBuilder
WORKDIR $GOPATH/src/github.com/afrima/japanese_learning_helper/src/backend
COPY backend .
RUN apk update && apk add --no-cache git
RUN go get -d -v
RUN go build -ldflags "-s -w" -o /go/bin/backend

FROM node:14.0 AS NodeBuilder
WORKDIR /app
COPY frontend/ .
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN yarn install --production=false
RUN npm run build

FROM alpine
LABEL maintainer=MathieuKeller@gmx.de
WORKDIR /app
COPY --from=GOBuilder /go/bin/backend .
COPY --from=NodeBuilder /app/dist ./dist
EXPOSE 8080
ENTRYPOINT ["/app/backend"]