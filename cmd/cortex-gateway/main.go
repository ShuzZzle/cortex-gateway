package main

import (
	"flag"
	"fmt"
	testgw "github.com/ShuzZzle/cortex-gateway/pkg/gateway"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api"
	cortexLog "github.com/cortexproject/cortex/pkg/util/log"
	"github.com/gorilla/mux"
	"net/http"
	"os"

	"github.com/cortexproject/cortex/pkg/util/flagext"
	"github.com/opentracing-contrib/go-stdlib/nethttp"
	"github.com/opentracing/opentracing-go"
	"github.com/weaveworks/common/middleware"
	"github.com/weaveworks/common/server"
	"github.com/weaveworks/common/tracing"
	"google.golang.org/grpc"
)

var (
	version     string
)

func main() {
	operationNameFunc := nethttp.OperationNameFunc(func(r *http.Request) string {
		return r.URL.RequestURI()
	})

	var (
		serverCfg = server.Config{
			HTTPListenPort: 8080,
			MetricsNamespace: "cortex_gateway",
			HTTPMiddleware: []middleware.Interface{
				middleware.Func(func(handler http.Handler) http.Handler {
					return nethttp.Middleware(opentracing.GlobalTracer(), handler, operationNameFunc)
				}),
			},
			GRPCMiddleware: []grpc.UnaryServerInterceptor{
				middleware.ServerUserHeaderInterceptor,
			},
		}
		gatewayCfg testgw.Config
	)

	flagext.RegisterFlags(&serverCfg, &gatewayCfg)
	flag.Parse()

	if gatewayCfg.VersionFlag {
		fmt.Printf("%s\n", version)
		os.Exit(0)
	}

	cortexLog.InitLogger(&serverCfg)

	// Must be done after initializing the logger, otherwise no log message is printed
	err := gatewayCfg.Validate()
	cortexLog.CheckFatal("validating gateway config", err)

	// Setting the environment variable JAEGER_AGENT_HOST enables tracing
	trace, err := tracing.NewFromEnv("cortex-gateway")
	cortexLog.CheckFatal("initializing tracing", err)
	defer trace.Close()

	svr, err := server.New(serverCfg)
	cortexLog.CheckFatal("initializing server", err)
	defer svr.Shutdown()

	// Setup proxy and register routes
	gateway, err := testgw.New(gatewayCfg, svr)
	cortexLog.CheckFatal("initializing gateway", err)
	gateway.RegisterRoutes()

	defer gateway.Close()

	weaveServer := svr.HTTPServer
	originalHandler := weaveServer.Handler
	muxRouter := mux.NewRouter()
	webApp := testgw.SpaHandler{StaticPath: "web/apps/cortex-ui/dist", IndexPath: "index.html"}
	muxRouter.PathPrefix("/cortex-ui").Handler(webApp)
	muxRouter.PathPrefix("/cortex-api").Handler(api.InitRouter())
	muxRouter.PathPrefix("/").Handler(originalHandler)
	weaveServer.Handler = muxRouter

	svr.Run()
}
