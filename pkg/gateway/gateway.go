package gateway

import (
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/experimental"
	cortexLog "github.com/cortexproject/cortex/pkg/util/log"
	"github.com/go-kit/kit/log"
	"github.com/go-kit/kit/log/level"
	"github.com/weaveworks/common/server"
	"net/http"
)

// Gateway hosts a reverse proxy for each upstream cortex service we'd like to tunnel after successful authentication
type Gateway struct {
	cfg                Config
	distributorProxy   *Proxy
	queryFrontendProxy *Proxy
	distributorClient  *experimental.Distributor
	server             *server.Server
}

// New instantiates a new Gateway
func New(cfg Config, svr *server.Server) (*Gateway, error) {
	// Initialize reverse proxy for each upstream target service
	distributor, err := newProxy(cfg.DistributorAddress, "distributor")
	if err != nil {
		return nil, err
	}
	queryFrontend, err := newProxy(cfg.QueryFrontendAddress, "query-frontend")
	if err != nil {
		return nil, err
	}

	// kubectl port-forward service/cortex-distributor-headless 9400:9095 -n cortex
	// dns:///cortex-distributor-headless:9400
	distributorClient := experimental.NewDistributorClient("dns:///example:9400")

	return &Gateway{
		cfg:                cfg,
		distributorProxy:   distributor,
		queryFrontendProxy: queryFrontend,
		server:             svr,
		distributorClient:  &distributorClient,
	}, nil
}


// RegisterRoutes binds all to be piped routes to their handlers
func (g *Gateway) RegisterRoutes() {
	g.server.HTTP.Path("/all_user_stats").HandlerFunc(g.distributorProxy.Handler)
	g.server.HTTP.Path("/api/prom/push").Handler(AuthenticateTenant.Wrap(http.HandlerFunc(g.distributorProxy.Handler)))
	g.server.HTTP.Path("/api/experimental/prom/push").Handler(AuthenticateTenant.Wrap(http.HandlerFunc(g.distributorClient.PromToCortexHandler)))
	g.server.HTTP.PathPrefix("/api").Handler(AuthenticateTenant.Wrap(http.HandlerFunc(g.queryFrontendProxy.Handler)))
	g.server.HTTP.Path("/health").HandlerFunc(g.healthCheck)
	g.server.HTTP.PathPrefix("/").HandlerFunc(g.notFoundHandler)
}

func (g *Gateway) healthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Ok"))
}

func (g *Gateway) notFoundHandler(w http.ResponseWriter, r *http.Request) {
	logger := log.With(cortexLog.WithContext(r.Context(), cortexLog.Logger), "ip_address", r.RemoteAddr)
	level.Info(logger).Log("msg", "no request handler defined for this route", "route", r.RequestURI)
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404 - Resource not found"))
}

func (g *Gateway) Close() {
	g.distributorClient.CloseConnection()
}