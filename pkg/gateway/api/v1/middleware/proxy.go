package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httputil"
)

func ReverseProxy(backend string) gin.HandlerFunc {
	target := backend

	return func(context *gin.Context) {
		director := func(req *http.Request) {
			r := context.Request
			req = r
			req.URL.Scheme = "http"
			req.URL.Host = target
		}
		proxy := &httputil.ReverseProxy{Director: director}
		proxy.ServeHTTP(context.Writer, context.Request)
	}
}
