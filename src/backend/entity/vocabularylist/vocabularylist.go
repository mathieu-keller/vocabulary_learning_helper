package vocabularylist

import "go.mongodb.org/mongo-driver/bson/primitive"

type VocabularyList struct {
	ID   primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	Name string             `bson:"name, omitempty" json:"name"`
}
