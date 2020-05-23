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

func GetDatabase(collectionName string) (*mongo.Collection, context.Context, context.CancelFunc) {
	if database == nil {
		connectToDatabase()
	}
	collection := database.Collection(collectionName)
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	return collection, ctx, closeCtx
}

func CloseCursor(ctx context.Context, cur *mongo.Cursor) {
	if err := cur.Close(ctx); err != nil {
		log.Print(err)
	}
}
