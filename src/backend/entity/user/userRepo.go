package user

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/afrima/japanese_learning_helper/src/backend/database"
)

func GetUser(userName string) (*User, error) {
	collection := database.GetDatabase().Collection("User")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	limit, findOptions := int64(1), options.Find()
	findOptions.Limit = &limit
	cur, err := collection.Find(ctx, bson.M{"username": userName}, findOptions)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	var user *User
	defer cur.Close(ctx)
	for cur.Next(ctx) {
		err := cur.Decode(&user)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		break
	}
	return user, nil
}

func (u *User) Insert() error {
	collection := database.GetDatabase().Collection("User")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	u.Id = primitive.NewObjectIDFromTimestamp(time.Now())
	_, err := collection.InsertOne(ctx, u)
	return err
}
