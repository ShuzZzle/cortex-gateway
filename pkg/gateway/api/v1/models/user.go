package models

import (
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/util"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID            primitive.ObjectID `bson:"_id"`
	Email         string             `json:"email" bson:"email"`
	EmailVerified bool               `json:"email_verified" bson:"email_verified"`
	CreatedAt     string             `json:"created_at" bson:"created_at"`
	UpdatedAt     string             `json:"updated_at" bson:"updated_at"`
}
type userEntity struct {
	db         *mongo.Database
	collection *mongo.Collection
}

func (u userEntity) Create(email string) (*User, error) {
	var user User
	ctx, cancel := util.InitContext()
	defer cancel()
	_, err := u.collection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}
	data, err := u.Read(email)
	return data, err
}

func (u userEntity) Read(email string) (*User, error) {
	ctx, cancel := util.InitContext()
	defer cancel()
	filter := bson.M{"email": email}
	res := u.collection.FindOne(ctx, filter)
	if res.Err() != nil {
		return nil, res.Err()
	}
	user := User{}
	err := res.Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

type UserEntity interface {
	Create(email string) (*User, error)
	Read(email string) (*User, error)
}

func NewUserEntity(resource *mongo.Database) UserEntity {
	collectionName := "user"
	collection := resource.Collection(collectionName)
	return &userEntity{
		db:         resource,
		collection: collection,
	}
}
