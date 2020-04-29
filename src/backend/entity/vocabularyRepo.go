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
	Id       primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	German   string `bson:"german, omitempty" json:"german"`
	Japanese string `bson:"japanese, omitempty" json:"japanese"`
	Kanji    string `bson:"kanji, omitempty" json:"kanji"`
}

type VocabErrors struct {
	errorText string
}

func GetVocabs() ([]Vocab, error) {
	collection := database.GetDatabase().Collection("Vocabulary")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer cur.Close(ctx)
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
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	if vocab.Id.IsZero() {
		vocab.Id = primitive.NewObjectIDFromTimestamp(time.Now())
		_, err := collection.InsertOne(ctx, vocab)
		return err
	} else {
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
		filter := bson.D{{"_id", vocab.Id}}
		update := bson.D{{Key: "$set", Value: obj}}
		_, err = collection.UpdateOne(
			context.Background(),
			filter,
			update,
			opts,
		)
		return err
	}
}

func (vocab Vocab) Delete() error {
	collection := database.GetDatabase().Collection("Vocabulary")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	_, err := collection.DeleteOne(ctx, bson.D{{"_id", vocab.Id}})
	return err
}

func (vocabErrors VocabErrors) Error() string {
	return vocabErrors.errorText
}
