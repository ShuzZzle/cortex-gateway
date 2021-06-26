package models

import (
	"errors"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/util"
	"github.com/gbrlsnchs/jwt/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type JWTPayload struct {
	jwt.Payload
	Tenant string `json:"tenant"`
	Team string `json:"team"`
}

type Token struct {
	ID        primitive.ObjectID `bson:"_id"`
	JWT       string             `json:"jwt" bson:"jwt"`
	CreatedAt string             `json:"created_at" bson:"created_at"`
	UpdatedAt string             `json:"updated_at" bson:"updated_at"`
}

type TokenExtraClaim struct {
	Tenant string
	Team string
}

type TokenRequest struct {
	Issuer string
	Subject string
	Audience []string
	//Expire string
	//NotBefore string
	//IssuedAt string
	Data *TokenExtraClaim
}

const (
	ISO_LAYOUT  = "2006-01-02T15:04:05-0700"
)
var hs *jwt.HMACSHA

func createToken(param *TokenRequest) (string, error){
	now := time.Now()
	payload := JWTPayload{
		Payload: jwt.Payload{
			Issuer:         param.Issuer,
			Subject:        param.Subject,
			Audience:       param.Audience,
			ExpirationTime: jwt.NumericDate(now.Add(24 * 30 * 12 * time.Hour)),
			NotBefore:      jwt.NumericDate(now.Add(5 * time.Minute)),
			IssuedAt:       jwt.NumericDate(now),
			JWTID:          util.RandStringRunes(15),
		},
		Tenant: param.Data.Tenant,
		Team: param.Data.Team,
	}

	token, err := jwt.Sign(payload, hs)
	if err != nil {
		return "", err
	}
	return string(token), nil
}

type tokenEntity struct {
	db *mongo.Database
	collection *mongo.Collection
}

func (t *tokenEntity) List() ([]*Token, error) {
	ctx, cancel := util.InitContext()
	defer cancel()
	cursor, err := t.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	var tokens []*Token
	for cursor.Next(ctx) {

		// create a value into which the single document can be decoded
		var elem Token
		err = cursor.Decode(&elem)
		if err != nil {
			return nil, err
		}

		tokens = append(tokens, &elem)
	}

	return tokens, nil
}

type TokenEntity interface {
	Create(tokenRequest *TokenRequest) (*Token, error)
	List() ([]*Token, error)
	Read(id string) (*Token, error)
	Update(id string, tokenRequest *TokenRequest) (*Token, error)
	Delete(id string) error
}

func NewTokenEntity(resource *mongo.Database, jwtSecret string) TokenEntity {
	collectionName := "token"
	collection := resource.Collection(collectionName)
	hs = jwt.NewHS512([]byte(jwtSecret))
	return &tokenEntity{
		db: resource,
		collection: collection,
	}
}

func (t *tokenEntity) Create(tokenRequest *TokenRequest) (*Token, error) {
	var token Token
	var err error
	ctx, cancel := util.InitContext()
	defer cancel()
	token.ID = primitive.NewObjectID()
	token.JWT, err = createToken(tokenRequest)
	if err != nil {
		return nil, err
	}
	token.CreatedAt = time.Now().Format(ISO_LAYOUT)
	token.UpdatedAt = time.Now().Format(ISO_LAYOUT)
	tokenRequestResult, err := t.collection.InsertOne(ctx, token)
	if err != nil {
		return nil, err
	}
	insertedId, ok := tokenRequestResult.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, errors.New("type assertion failed")
	}
	data, err := t.Read(insertedId.Hex())
	return data, err
}

func (t *tokenEntity) Read(id string) (*Token, error) {
	ctx, cancel := util.InitContext()
	defer cancel()
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objectId}
	res := t.collection.FindOne(ctx, filter)
	if res.Err() != nil {
		return nil, res.Err()
	}
	token := Token{}
	err = res.Decode(&token)
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (t *tokenEntity) Delete(id string) error {
	ctx, cancel := util.InitContext()
	defer cancel()
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectId}
	_, err = t.collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	return nil
}

func (t *tokenEntity) Update(id string, tokenRequest *TokenRequest) (*Token, error) {
	ctx, cancel := util.InitContext()
	defer cancel()
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var token Token
	oldToken, err := t.Read(id)
	if err != nil {
		return nil, err
	}
	token.ID = oldToken.ID
	token.JWT, err = createToken(tokenRequest)
	if err != nil {
		return nil, err
	}
	token.CreatedAt = oldToken.CreatedAt
	token.UpdatedAt = time.Now().Format(ISO_LAYOUT)

	filter := bson.M{"_id": objectId}
	res := t.collection.FindOneAndReplace(ctx, filter, token)
	if res.Err() != nil {
		return nil, res.Err()
	}

	return &token, nil
}