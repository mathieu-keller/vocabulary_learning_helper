package entity

import (
	"context"
	"github.com/afrima/japanese_learning_helper/src/backend/database"
	"go.mongodb.org/mongo-driver/bson"
	"log"
	"time"
)

type Vocab struct {
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
	_, err := collection.InsertOne(ctx, vocab)
	return err
}

func (vocabErrors VocabErrors) Error() string {
	return vocabErrors.errorText
}
