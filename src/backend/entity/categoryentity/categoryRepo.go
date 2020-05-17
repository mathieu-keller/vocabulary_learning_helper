package categoryentity

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/afrima/japanese_learning_helper/src/backend/database"
	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabularyentity"
	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabularylistentity"
)

func GetCategory() ([]Category, error) {
	collection := database.GetDatabase().Collection("Category")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer database.CloseCursor(ctx, cur)
	var returnValue []Category
	if err := cur.All(ctx, &returnValue); err != nil {
		log.Println(err)
		return nil, err
	}
	if err := cur.Err(); err != nil {
		log.Println(err)
		return nil, err
	}
	return returnValue, nil
}

func (category *Category) Insert() error {
	if category.Name == "" || len(category.Columns) < 2 {
		return vocabularyentity.Error{ErrorText: "Category need a name and 2 or more columns!"}
	}
	collection := database.GetDatabase().Collection("Category")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	if category.ID.IsZero() {
		category.ID = primitive.NewObjectIDFromTimestamp(time.Now())
		_, err := collection.InsertOne(ctx, category)
		return err
	}
	pByte, err := bson.Marshal(category)
	if err != nil {
		return err
	}

	var obj bson.M
	err = bson.Unmarshal(pByte, &obj)
	if err != nil {
		return err
	}
	opts := options.Update().SetUpsert(true)
	filter := bson.D{{Key: "_id", Value: category.ID}}
	update := bson.D{{Key: "$set", Value: obj}}
	_, err = collection.UpdateOne(
		context.Background(),
		filter,
		update,
		opts,
	)
	return err
}

func (category Category) Delete() error {
	collection := database.GetDatabase().Collection("Category")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	_, err := collection.DeleteOne(ctx, bson.D{{Key: "_id", Value: category.ID}})
	if err != nil {
		return err
	}
	return vocabularylistentity.DeleteWithCategoryID(category.ID)
}