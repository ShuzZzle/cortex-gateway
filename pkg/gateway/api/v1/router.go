package v1

import (
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/oauth2"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1/models"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1/services"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/database"
	"github.com/gin-gonic/gin"
)

type ServiceRouter struct {
	OAuth2 *oauth2.Configuration
}

func (s *ServiceRouter) InitV1Router(r *gin.Engine, database *database.Database, jwtSecret string) {
	// This is required because gin doesn't know that the handler is already registered at /api
	cortexApi := r.Group("/api/v1")
	{
		tokenRepository := models.NewTokenEntity(database.MongoDatabase, jwtSecret)
		cortexApi.GET("/tokens/:id", services.GetTokenDetails(tokenRepository))
		cortexApi.PUT("/tokens/:id", services.UpdateToken(tokenRepository))
		cortexApi.GET("/tokens", services.GetToken(tokenRepository))
		cortexApi.DELETE("/tokens/:id", services.DeleteToken(tokenRepository))
		cortexApi.POST("/tokens", services.CreateToken(tokenRepository))
	}
}