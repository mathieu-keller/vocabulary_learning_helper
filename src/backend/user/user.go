package user

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID `bson:"_id, omitempty"`
	UserName string             `bson:"username, omitempty"`
	Password string             `bson:"password, omitempty"`
}
