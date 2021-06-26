package rbac

import (
	_ "embed"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1/app"
	"github.com/casbin/casbin/v2"
	mongodbadapter "github.com/casbin/mongodb-adapter/v3"
	"github.com/gin-gonic/gin"
	mongooptions "go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

type CortexEnforcer struct {
	*casbin.Enforcer
}

func NewEnforcer(config *gateway.Config) *CortexEnforcer {
	mongoClientOption := mongooptions.Client().ApplyURI(config.DatabaseURI)
	databaseName := "cortex-gateway"
	a,err := mongodbadapter.NewAdapterWithCollectionName(mongoClientOption, databaseName, "casbin")
	// Or you can use NewAdapterWithCollectionName for custom collection name.
	if err != nil {
		panic(err)
	}

	enforcer, err := casbin.NewEnforcer("policies/rbac_model.conf", a)
	if err != nil {
		panic(err)
	}

	// Load the policy from DB.
	err = enforcer.LoadPolicy()
	if err != nil {
		panic(err)
	}
	// enforcer.AddPolicy("user", "tenant", "data1", "read")

	enforcer.EnableAutoSave(true)

	return &CortexEnforcer{enforcer}
}

func (enforcer *CortexEnforcer) Authorize(domain string, obj string, act string) gin.HandlerFunc {
	// Authorize("domain", "tokens", "read")
	return func(ctx *gin.Context) {
		app := app.Gin{C: ctx}
		val, existed := ctx.Get("current_subject")
		if !existed {
			app.AbortWithResponse(http.StatusUnauthorized, "user is not logged in", nil)
			return
		}

		err := enforcer.LoadPolicy()
		if err != nil {
			app.AbortWithResponse(http.StatusInternalServerError, "failed to load policies from db", nil)
			return
		}

		// User,Domain,Object,Action
		ok, err := enforcer.Enforce(val, domain, obj, act)
		if err != nil {
			app.AbortWithResponse(http.StatusInternalServerError, "an error occurred when authorizing user", nil)
			return
		}
		if !ok {
			app.AbortWithResponse(http.StatusForbidden, "forbidden", nil)
			return
		}

		ctx.Next()
	}
}
