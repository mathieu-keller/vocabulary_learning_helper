package userentity

import (
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/afrima/vocabulary_learning_helper/src/backend/database"
)

func GetUser(userName string) (*User, error) {
	collection, ctx, closeCtx := database.GetDatabase("User")
	defer closeCtx()
	limit, findOptions := int64(1), options.Find()
	findOptions.Limit = &limit
	cur, err := collection.Find(ctx, bson.M{"username": userName}, findOptions)
	defer database.CloseCursor(ctx, cur)
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

func (u *User) Insert() error {
	collection, ctx, closeCtx := database.GetDatabase("User")
	defer closeCtx()
	u.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	_, err := collection.InsertOne(ctx, u)
	return err
}
