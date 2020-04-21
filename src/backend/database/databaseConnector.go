package database

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

var database *mongo.Database

func connectToDatabase() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(
		"mongodb+srv://goUser:Start123@cluster0-mxqh4.mongodb.net/test?retryWrites=true&w=majority",
	))
	if err != nil {
		log.Fatal(err)
	}
	database = client.Database("JapaneseLearning")
}

func GetDatabase() *mongo.Database {
	if database != nil {
		return database
	} else {
		connectToDatabase()
		return database
	}
}
