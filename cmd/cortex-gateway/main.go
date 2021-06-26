package main

import (
	"flag"
	"fmt"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/database"
	cortexLog "github.com/cortexproject/cortex/pkg/util/log"
	"github.com/gorilla/mux"
	"net/http"
	"os"
	"runtime"

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
		ballast []byte
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
		gatewayCfg gateway.Config
	)

	flagext.RegisterFlags(&serverCfg, &gatewayCfg)
	flag.Parse()

	if gatewayCfg.VersionFlag {
		fmt.Printf("%s\n", version)
		os.Exit(0)
	}

	if gatewayCfg.BallastBytes > 0 {
		ballast = make([]byte, gatewayCfg.BallastBytes)
	}

	cortexLog.InitLogger(&serverCfg)

	// Must be done after initializing the logger, otherwise no log message is printed
	err := gatewayCfg.Validate()
	cortexLog.CheckFatal("validating cortexGateway config", err)

	// Setting the environment variable JAEGER_AGENT_HOST enables tracing
	trace, err := tracing.NewFromEnv("cortex-cortexGateway")
	cortexLog.CheckFatal("initializing tracing", err)
	defer trace.Close()

	svr, err := server.New(serverCfg)
	cortexLog.CheckFatal("initializing server", err)
	defer svr.Shutdown()

	// Setup proxy and register routes
	cortexGateway, err := gateway.New(gatewayCfg, svr)
	cortexLog.CheckFatal("initializing cortexGateway", err)
	cortexGateway.RegisterRoutes()

	defer cortexGateway.Close()

	mongoDB, err := database.Init(&gatewayCfg)
	if err != nil {
		//unreachable since database error panics the program
		panic(err)
	}
	defer mongoDB.Close()

	weaveServer := svr.HTTPServer
	// basically /metrics and /debug/pprof
	originalHandler := weaveServer.Handler
	muxRouter := mux.NewRouter()
	muxRouter.PathPrefix("/ui").Handler(gateway.AssetHandler("/ui"))
	muxRouter.PathPrefix("/api").Handler(api.InitV1Router(&gatewayCfg, mongoDB))
	muxRouter.PathPrefix("/").Handler(originalHandler)
	weaveServer.Handler = muxRouter

	svr.Run()
	runtime.KeepAlive(ballast)
}
