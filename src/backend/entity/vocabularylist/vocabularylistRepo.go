package vocabularylist

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/afrima/japanese_learning_helper/src/backend/database"
	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabulary"
)

func GetVocabularyList() ([]VocabularyList, error) {
	collection := database.GetDatabase().Collection("VocabularyList")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer database.CloseCursor(ctx, cur)
	var returnValue []VocabularyList
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

func (vocabularyList *VocabularyList) Insert() error {
	if vocabularyList.Name == "" {
		return vocabulary.VocabErrors{ErrorText: "German and Japanese must be filled"}
	}
	collection := database.GetDatabase().Collection("VocabularyList")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	if vocabularyList.ID.IsZero() {
		vocabularyList.ID = primitive.NewObjectIDFromTimestamp(time.Now())
		_, err := collection.InsertOne(ctx, vocabularyList)
		return err
	}
	pByte, err := bson.Marshal(vocabularyList)
	if err != nil {
		return err
	}

	var obj bson.M
	err = bson.Unmarshal(pByte, &obj)
	if err != nil {
		return err
	}
	opts := options.Update().SetUpsert(true)
	filter := bson.D{{Key: "_id", Value: vocabularyList.ID}}
	update := bson.D{{Key: "$set", Value: obj}}
	_, err = collection.UpdateOne(
		context.Background(),
		filter,
		update,
		opts,
	)
	return err
}

func (vocabularyList VocabularyList) Delete() error {
	collection := database.GetDatabase().Collection("VocabularyList")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	_, err := collection.DeleteOne(ctx, bson.D{{Key: "_id", Value: vocabularyList.ID}})
	if err != nil {
		return err
	}
	return vocabulary.DeleteWithListID(vocabularyList.ID)
}
