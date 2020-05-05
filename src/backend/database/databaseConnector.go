package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var database *mongo.Database

func connectToDatabase() {
	const duration = 10 * time.Second
	ctx, cancel := context.WithTimeout(context.Background(), duration)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(
		"mongodb+srv://"+os.Getenv("dbUser")+":"+os.Getenv("dbPassword")+"@"+os.Getenv("dbAddress"),
	))
	if err != nil {
		log.Fatal(err)
	}
	database = client.Database("JapaneseLearning")
}

func GetDatabase() *mongo.Database {
	if database != nil {
		return database
	}
	connectToDatabase()
	return database
}
