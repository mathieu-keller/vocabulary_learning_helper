package vocabulary

import "go.mongodb.org/mongo-driver/bson/primitive"

type Vocab struct {
	ID       primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	ListID   primitive.ObjectID `bson:"listID, omitempty" json:"listId"`
	German   string             `bson:"german, omitempty" json:"german"`
	Japanese string             `bson:"japanese, omitempty" json:"japanese"`
	Kanji    string             `bson:"kanji, omitempty" json:"kanji"`
}
