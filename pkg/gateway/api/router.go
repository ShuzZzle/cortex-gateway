package api

import (
	v1 "github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	apiv1 := r.Group("/cortex-api/v1")
	{
		apiv1.GET("/hello", v1.HelloWorld)
	}

	return r
}
