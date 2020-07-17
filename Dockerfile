ARG TRAVIS_BUILD_NUMBER
FROM afrima/vocabulary_trainer_fe:${TRAVIS_BUILD_NUMBER} as frontend
FROM afrima/vocabulary_trainer_be:${TRAVIS_BUILD_NUMBER} as backend

FROM alpine:latest
LABEL maintainer=MathieuKeller@gmx.de
WORKDIR /app
COPY --from=backend /app/dist .
COPY --from=frontend /app/dist ./dist
EXPOSE 443
ENTRYPOINT ["/app/backend"]
