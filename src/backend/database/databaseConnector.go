package database

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

var database *mongo.Database

func connectToDatabase() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
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
	} else {
		connectToDatabase()
		return database
	}
}
