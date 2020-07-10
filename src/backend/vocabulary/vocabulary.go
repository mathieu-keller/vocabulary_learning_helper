package vocabulary

import "go.mongodb.org/mongo-driver/bson/primitive"

type Values struct {
	Key    string   `bson:"key, omitempty" json:"key"`
	Values []string `bson:"values, omitempty" json:"values"`
}

type Vocabulary struct {
	ID     primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	ListID primitive.ObjectID `bson:"listID, omitempty" json:"listId"`
	Values []Values           `bson:"values, omitempty" json:"values"`
}
