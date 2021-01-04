FROM alpine:latest
LABEL maintainer=MathieuKeller@gmx.de
WORKDIR /app
COPY backend .
COPY bundles ./dist
RUN chmod 0777 backend
EXPOSE 443
ENTRYPOINT ["/app/backend"]
