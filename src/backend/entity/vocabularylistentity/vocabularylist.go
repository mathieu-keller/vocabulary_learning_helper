package vocabularylistentity

import "go.mongodb.org/mongo-driver/bson/primitive"

type VocabularyList struct {
	Name       string             `bson:"name, omitempty" json:"name"`
	ID         primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	CategoryID primitive.ObjectID `bson:"categoryID, omitempty" json:"categoryId"`
}
