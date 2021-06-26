package app

import "C"
import "github.com/gin-gonic/gin"

type Gin struct {
	*gin.Context
}

type JSONResult struct {
	Code    int          `json:"code"`
	Message string       `json:"message"`
	Data    interface{}  `json:"data"`
}

func (g *Gin) Response(status int, message string, data interface{}) {
	g.JSON(status, JSONResult{
		Code:    status,
		Message: message,
		Data:    data,
	})
}

func (g *Gin) AbortWithResponse(status int, message string, data interface{}) {
	g.Abort()
	g.JSON(status, JSONResult{
		Code:    status,
		Message: message,
		Data:    data,
	})
}
