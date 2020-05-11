package vocabulary

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/afrima/japanese_learning_helper/src/backend/database"
)

type VocabErrors struct {
	ErrorText string
}

func GetVocabs(listID string) ([]Vocab, error) {
	id, err := primitive.ObjectIDFromHex(listID)
	if err != nil {
		return nil, err
	}
	collection := database.GetDatabase().Collection("Vocabulary")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	cur, err := collection.Find(ctx, bson.D{{Key: "listID", Value: id}})
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer database.CloseCursor(ctx, cur)
	returnValue := make([]Vocab, 0, 20)
	for cur.Next(ctx) {
		var result Vocab
		err := cur.Decode(&result)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		returnValue = append(returnValue, result)
	}
	if err := cur.Err(); err != nil {
		log.Println(err)
		return nil, err
	}
	return returnValue, nil
}

func (vocab *Vocab) InsertVocab() error {
	if vocab.German == "" || (vocab.Japanese == "" && vocab.Kanji == "") {
		return VocabErrors{"German and Japanese must be filled"}
	}
	collection := database.GetDatabase().Collection("Vocabulary")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	if vocab.ID.IsZero() {
		vocab.ID = primitive.NewObjectIDFromTimestamp(time.Now())
		_, err := collection.InsertOne(ctx, vocab)
		return err
	}
	pByte, err := bson.Marshal(vocab)
	if err != nil {
		return err
	}

	var obj bson.M
	err = bson.Unmarshal(pByte, &obj)
	if err != nil {
		return err
	}
	opts := options.Update().SetUpsert(true)
	filter := bson.D{{Key: "_id", Value: vocab.ID}}
	update := bson.D{{Key: "$set", Value: obj}}
	_, err = collection.UpdateOne(
		context.Background(),
		filter,
		update,
		opts,
	)
	return err
}

func (vocab Vocab) Delete() error {
	collection := database.GetDatabase().Collection("Vocabulary")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	_, err := collection.DeleteOne(ctx, bson.D{{Key: "_id", Value: vocab.ID}})
	return err
}

func DeleteWithListID(listID primitive.ObjectID) error {
	collection := database.GetDatabase().Collection("Vocabulary")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	_, err := collection.DeleteMany(ctx, bson.D{{Key: "listID", Value: listID}})
	return err
}

func GetRandomVocabularyByListIds(ids []primitive.ObjectID, limit int8) ([]Vocab, error) {
	collection := database.GetDatabase().Collection("Vocabulary")
	const duration = 30 * time.Second
	ctx, closeCtx := context.WithTimeout(context.Background(), duration)
	defer closeCtx()
	cur, err := collection.Aggregate(ctx, mongo.Pipeline{
		bson.D{{Key: "$match", Value: bson.M{"listID": bson.M{"$in": ids}}}},
		bson.D{{Key: "$sample", Value: bson.M{"size": limit}}},
	})
	if err != nil {
		return nil, err
	}
	defer database.CloseCursor(ctx, cur)
	returnValue := make([]Vocab, 0, 20)
	for cur.Next(ctx) {
		var result Vocab
		err := cur.Decode(&result)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		returnValue = append(returnValue, result)
	}
	if err := cur.Err(); err != nil {
		log.Println(err)
		return nil, err
	}
	return returnValue, nil
}

func (vocabErrors VocabErrors) Error() string {
	return vocabErrors.ErrorText
}
