package vocabularyentity

import "go.mongodb.org/mongo-driver/bson/primitive"

type Value struct {
	Key   string `bson:"key, omitempty" json:"key"`
	Value string `bson:"value, omitempty" json:"value"`
}

type Vocabulary struct {
	ID     primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	ListID primitive.ObjectID `bson:"listID, omitempty" json:"listId"`
	Values []Value            `bson:"values, omitempty" json:"values"`
}
