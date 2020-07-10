package category

import "go.mongodb.org/mongo-driver/bson/primitive"

type Category struct {
	ID      primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	Name    string             `bson:"name, omitempty" json:"name"`
	Columns []string           `bson:"columns, omitempty" json:"columns"`
	Owner   string             `bson:"owner, omitempty" json:"owner"`
}
