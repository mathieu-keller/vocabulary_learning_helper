package userentity

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/afrima/vocabulary_learning_helper/src/backend/database"
)

func GetUser(userName string) (*User, error) {
	collection := database.GetDatabase().Collection("User")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	limit, findOptions := int64(1), options.Find()
	findOptions.Limit = &limit
	cur, err := collection.Find(ctx, bson.M{"username": userName}, findOptions)
	defer closeCursor(ctx, cur)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	var user *User
	for cur.Next(ctx) {
		err := cur.Decode(&user)
		if err != nil {
			log.Println(err)
			return nil, err
		}
	}
	return user, nil
}

func closeCursor(ctx context.Context, cur *mongo.Cursor) {
	if err := cur.Close(ctx); err != nil {
		log.Print(err)
	}
}

func (u *User) Insert() error {
	collection := database.GetDatabase().Collection("User")
	const duration = 30 * time.Second
	ctx, cancel := context.WithTimeout(context.Background(), duration)
	defer cancel()
	u.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	_, err := collection.InsertOne(ctx, u)
	return err
}
