package database

import (
	"context"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

type Database struct {
	MongoClient *mongo.Client
	MongoDatabase *mongo.Database
}

func Init(cfg *gateway.Config) (*Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.DatabaseURI))
	if err != nil {
		panic(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	return &Database{MongoClient: client, MongoDatabase: client.Database("cortex-gateway")}, nil
}

func (d *Database) Close() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	log.Println("Closing DB connection....")
	if err := d.MongoClient.Disconnect(ctx); err != nil {
		panic(err)
	}
}
