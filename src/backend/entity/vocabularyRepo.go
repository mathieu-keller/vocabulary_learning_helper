package entity

import (
	"context"
	"github.com/afrima/japanese_learning_helper/src/backend/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

type Vocab struct {
	Id       primitive.ObjectID `bson:"_id, omitempty"`
	German   string
	Japanese string
	Kanji    string
}

type VocabErrors struct {
	errorText string
}

func GetVocabs() []Vocab {
	collection := database.GetDatabase().Collection("Vocabulary")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(ctx)
	returnValue := make([]Vocab, 0, 20)
	for cur.Next(ctx) {
		var result Vocab
		err := cur.Decode(&result)
		if err != nil {
			log.Fatal(err)
		}
		returnValue = append(returnValue, result)
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	return returnValue
}

func (vocab Vocab) InsertVocab() error {
	if vocab.German == "" || (vocab.Japanese == "" && vocab.Kanji == "") {
		return VocabErrors{"German and Japanese must be filled"}
	}
	collection := database.GetDatabase().Collection("Vocabulary")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	if vocab.Id.IsZero() {
		_, err := collection.InsertOne(ctx, vocab)
		return err
	} else {
		opts := options.Update().SetUpsert(true)
		filter := bson.D{{"_id", vocab.Id}}
		update := bson.D{{"$set", bson.D{{"German", vocab.German}}}}
		_, err := collection.UpdateOne(
			context.Background(),
			filter,
			update,
			opts,
		)
		return err
	}
}

func (vocabErrors VocabErrors) Error() string {
	return vocabErrors.errorText
}
