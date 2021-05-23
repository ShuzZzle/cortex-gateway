package v1

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func HelloWorld(c *gin.Context) {
	c.String(http.StatusOK, "Hello World!")
}