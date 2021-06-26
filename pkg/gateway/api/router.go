package api

import (
	_ "github.com/ShuzZzle/cortex-gateway/docs"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/oauth2"
	v1 "github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/database"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/securecookie"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

const (
	defaultPage = "0"
	defaultPageSize  = "25"
)

// InitV1Router godoc
// @title cortex-gateway API
// @version 1.0
// @description this is the API for the cortex-gateway
// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io
// @host localhost:8080
// @BasePath /api/v1
// @in header
// @name Authorization
// @securitydefinitions.oauth2.implicit OAuth2Implicit
// @tokenUrl http://localhost:8100/auth/realms/cortex-gateway/protocol/openid-connect/token
// @authorizationurl http://localhost:8100/auth/realms/cortex-gateway/protocol/openid-connect/auth
func InitV1Router(config *gateway.Config, database *database.Database) *gin.Engine {
	r := gin.New()
	store := cookie.NewStore(securecookie.GenerateRandomKey(32))
	r.Use(sessions.Sessions("user", store))
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	//TODO: Make port parameterized
	url := ginSwagger.URL("/api/swagger/doc.json")
	r.GET("/api/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	r.GET("/api/login", oauth2Config.Login)
	r.GET("/api/logout", oauth2Config.Logout)
	r.GET("/api/callback", oauth2Config.Callback)

	protected := r.Group("/api/protected")
	{
		protected.Use(oauth2Config.Authenticate())
		protected.GET("/helloworld", helloworld)
	}
	serviceRouter := v1.ServiceRouter{OAuth2: oauth2Config}
	serviceRouter.InitV1Router(r, database, config.JWTSecret)

	return r
}

var oauth2Config *oauth2.Configuration

func helloworld(ctx *gin.Context)  {
	ctx.Writer.Write([]byte("protected!"))
}

func init() {
	oauth2Config = oauth2.NewAuthConfiguration()
}
