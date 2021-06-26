package middleware

import (
	"fmt"
	cortexLog "github.com/cortexproject/cortex/pkg/util/log"
	"github.com/dgrijalva/jwt-go"
	jwtReq "github.com/dgrijalva/jwt-go/request"
	"github.com/gin-gonic/gin"
	"github.com/go-kit/kit/log"
	"github.com/go-kit/kit/log/level"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"net/http"
)

var (
	authFailures = promauto.NewCounterVec(prometheus.CounterOpts{
		Namespace: "cortex_gateway",
		Name:      "failed_authentications_total",
		Help:      "The total number of failed authentications.",
	}, []string{"reason"})
	authSuccess = promauto.NewCounterVec(prometheus.CounterOpts{
		Namespace: "cortex_gateway",
		Name:      "succeeded_authentications_total",
		Help:      "The total number of succeeded authentications.",
	}, []string{"tenant"})
)

type tenant struct {
	TenantID string `json:"tenant_id"`
	Audience string `json:"aud"`
	Version  uint8  `json:"version"`
}

// Valid returns an error if JWT payload is incomplete
func (t *tenant) Valid() error {
	if t.TenantID == "" {
		return fmt.Errorf("tenant is empty")
	}

	return nil
}


func AuthenticateJWT(jwtSecret string) gin.HandlerFunc {
	return func(context *gin.Context) {
		request := context.Request
		writer := context.Writer
		logger := log.With(cortexLog.WithContext(request.Context(), cortexLog.Logger), "ip_address", request.RemoteAddr)
		level.Debug(logger).Log("msg", "authenticating request", "route", request.RequestURI)


		tokenString := request.Header.Get("Authorization") // Get operation is case insensitive
		if tokenString == "" {
			level.Info(logger).Log("msg", "no bearer token provided")
			http.Error(writer, "No bearer token provided", http.StatusUnauthorized)
			authFailures.WithLabelValues("no_token").Inc()

			return
		}

		// Try to parse and validate JWT
		te := &tenant{}
		_, err := jwtReq.ParseFromRequest(
			request,
			jwtReq.AuthorizationHeaderExtractor,
			//TODO: Switch library since its not maintained a has open CVE's
			func(token *jwt.Token) (interface{}, error) {
				// Only HMAC algorithms accepted - algorithm validation is super important!
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					level.Info(logger).Log("msg", "unexpected signing method", "used_method", token.Header["alg"])
					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
				}

				return []byte(jwtSecret), nil
			},
			jwtReq.WithClaims(te))

		// If tenant's Valid method returns false an error will be set as well, hence there is no need
		// to additionally check the parsed token for "Valid"
		if err != nil {
			level.Info(logger).Log("msg", "invalid bearer token", "err", err.Error())
			http.Error(writer, "Invalid bearer token", http.StatusUnauthorized)
			authFailures.WithLabelValues("token_not_valid").Inc()

			return
		}

		// Token is valid
		authSuccess.WithLabelValues(te.TenantID).Inc()
		request.Header.Set("X-Scope-OrgID", te.TenantID)
		//next.ServeHTTP(writer, request)
	}
}