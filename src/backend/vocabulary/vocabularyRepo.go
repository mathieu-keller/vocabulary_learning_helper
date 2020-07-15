package vocabulary

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

func GetVocabularyByIDs(ids []primitive.ObjectID) ([]Vocabulary, error) {
	collection, ctx, closeCtx := database.GetDatabase("Vocabulary")
	defer closeCtx()
	cur, err := collection.Find(ctx, bson.D{{Key: "_id", Value: bson.M{"$in": ids}}})
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer database.CloseCursor(ctx, cur)
	returnValue, err := getValuesFromCursor(ctx, cur)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return returnValue, nil
}

func GetVocabularyByListID(listID string) ([]Vocabulary, error) {
	id, err := primitive.ObjectIDFromHex(listID)
	if err != nil {
		return nil, err
	}
	collection, ctx, closeCtx := database.GetDatabase("Vocabulary")
	defer closeCtx()
	cur, err := collection.Find(ctx, bson.D{{Key: "listID", Value: id}})
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer database.CloseCursor(ctx, cur)
	returnValue, err := getValuesFromCursor(ctx, cur)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	if returnValue == nil {
		returnValue = make([]Vocabulary, 0)
	}
	return returnValue, nil
}

func (vocabulary *Vocabulary) InsertVocab() error {
	if len(vocabulary.Values) < 2 {
		return Error{ErrorText: "2 Values must be filled"}
	}
	collection, ctx, closeCtx := database.GetDatabase("Vocabulary")
	defer closeCtx()
	if vocabulary.ID.IsZero() {
		vocabulary.ID = primitive.NewObjectIDFromTimestamp(time.Now())
		_, err := collection.InsertOne(ctx, vocabulary)
		return err
	}
	pByte, err := bson.Marshal(vocabulary)
	if err != nil {
		return err
	}

	var obj bson.M
	err = bson.Unmarshal(pByte, &obj)
	if err != nil {
		return err
	}
	opts := options.Update().SetUpsert(true)
	filter := bson.D{{Key: "_id", Value: vocabulary.ID}}
	update := bson.D{{Key: "$set", Value: obj}}
	_, err = collection.UpdateOne(
		context.Background(),
		filter,
		update,
		opts,
	)
	return err
}

func InsertVocabularies(vocabularies []Vocabulary) error {
	collection, ctx, closeCtx := database.GetDatabase("Vocabulary")
	defer closeCtx()
	s := make([]interface{}, len(vocabularies))
	for i, v := range vocabularies {
		s[i] = v
	}
	_, err := collection.InsertMany(ctx, s)
	return err
}

func (vocabulary Vocabulary) Delete() error {
	collection, ctx, closeCtx := database.GetDatabase("Vocabulary")
	defer closeCtx()
	_, err := collection.DeleteOne(ctx, bson.D{{Key: "_id", Value: vocabulary.ID}})
	return err
}

func DeleteWithListID(listID primitive.ObjectID) error {
	collection, ctx, closeCtx := database.GetDatabase("Vocabulary")
	defer closeCtx()
	_, err := collection.DeleteMany(ctx, bson.D{{Key: "listID", Value: listID}})
	return err
}

func GetRandomVocabularyByListIds(ids []primitive.ObjectID, limit int8) ([]Vocabulary, error) {
	collection, ctx, closeCtx := database.GetDatabase("Vocabulary")
	defer closeCtx()
	cur, err := collection.Aggregate(ctx, mongo.Pipeline{
		bson.D{{Key: "$match", Value: bson.M{"listID": bson.M{"$in": ids}}}},
		bson.D{{Key: "$sample", Value: bson.M{"size": limit}}},
	})
	if err != nil {
		return nil, err
	}
	defer database.CloseCursor(ctx, cur)
	returnValue, err := getValuesFromCursor(ctx, cur)
	if err != nil {
		return nil, err
	}
	return returnValue, nil
}

func getValuesFromCursor(ctx context.Context, cur *mongo.Cursor) ([]Vocabulary, error) {
	var returnValue []Vocabulary
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

func (vocabulary *Vocabulary) GetValueByKey(key string) Values {
	for _, value := range vocabulary.Values {
		if value.Key == key {
			return value
		}
	}
	return Values{}
}
