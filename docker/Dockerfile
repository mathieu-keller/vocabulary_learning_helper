FROM alpine:latest
LABEL maintainer=MathieuKeller@gmx.de
WORKDIR /app
COPY backend .
COPY ./frontend ./dist
EXPOSE 443
ENTRYPOINT ["/app/backend"]
