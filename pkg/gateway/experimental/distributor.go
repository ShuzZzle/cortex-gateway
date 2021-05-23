package experimental

import (
	"context"
	"errors"
	"fmt"
	"github.com/cortexproject/cortex/pkg/cortexpb"
	"github.com/cortexproject/cortex/pkg/distributor/distributorpb"
	"github.com/cortexproject/cortex/pkg/util"
	"github.com/cortexproject/cortex/pkg/util/grpcclient"
	"github.com/cortexproject/cortex/pkg/util/log"
	"github.com/go-kit/kit/log/level"
	otgrpc "github.com/opentracing-contrib/go-grpc"
	"github.com/opentracing/opentracing-go"
	"github.com/weaveworks/common/middleware"
	"github.com/weaveworks/common/user"
	"google.golang.org/grpc"
	"net/http"
	"time"
)

const (
	defaultServerMaxReceiveMessageSize = 1024 * 1024 * 16
	defaultServerMaxSendMessageSize    = 4 * 1024 * 1024
)

func MakeCorrectTimeStamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

type Distributor struct {
	conn              *grpc.ClientConn
	distributorClient distributorpb.DistributorClient
}

func NewDistributorClient(address string) Distributor {
	logger := log.Logger
	cfg := grpcclient.Config{
		MaxRecvMsgSize:      defaultServerMaxReceiveMessageSize,
		MaxSendMsgSize:      defaultServerMaxSendMessageSize,
		GRPCCompression:     "",
		RateLimit:           0,
		RateLimitBurst:      0,
		BackoffOnRatelimits: false,
		TLSEnabled:          false,
	}
	opts, err := cfg.DialOption(SetupInterceptors())
	opts = append(opts, grpc.WithInsecure())
	opts = append(opts, grpc.WithDefaultServiceConfig(fmt.Sprintf(`{"loadBalancingPolicy":"%s"}`, name)))
	if err != nil {
		level.Error(logger).Log("err", err.Error())
	}

	conn, err := grpc.Dial(address, opts...)
	if err != nil {
		level.Error(logger).Log("err", err.Error())
	}

	return Distributor{
		conn:              conn,
		distributorClient: distributorpb.NewDistributorClient(conn),
	}
}

func SetupInterceptors() ([]grpc.UnaryClientInterceptor, []grpc.StreamClientInterceptor) {
	return []grpc.UnaryClientInterceptor{
			otgrpc.OpenTracingClientInterceptor(opentracing.GlobalTracer()),
			middleware.ClientUserHeaderInterceptor,
		}, []grpc.StreamClientInterceptor{
			otgrpc.OpenTracingStreamClientInterceptor(opentracing.GlobalTracer()),
			middleware.StreamClientUserHeaderInterceptor,
		}
}

func PromToCortex(ctx context.Context, r *http.Request, maxRecvMsgSize int) (*cortexpb.PreallocWriteRequest, error) {
	var req cortexpb.PreallocWriteRequest
	err := util.ParseProtoReader(ctx, r.Body, int(r.ContentLength), maxRecvMsgSize, &req, util.RawSnappy)
	if err != nil {
		return nil, errors.New("err: " + err.Error())
	}
	req.SkipLabelNameValidation = false

	if req.Source == 0 {
		req.Source = cortexpb.API
	}
	return &req, nil
}

func (d* Distributor) CloseConnection() {
	logger := log.Logger
	err := d.conn.Close()
	if err != nil {
		level.Error(logger).Log("err", err.Error())
	}
}


func (d *Distributor) PromToCortexHandler(writer http.ResponseWriter, request *http.Request) {
	ctx := request.Context()

	logger := log.WithContext(ctx, log.Logger)

	proto, err := PromToCortex(ctx, request, defaultServerMaxReceiveMessageSize)
	if err != nil {
		level.Error(logger).Log("err", err.Error())
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	tenant := request.Header.Get("X-Scope-OrgID")
	if tenant == "" {
		level.Error(logger).Log("err: no org id")
		http.Error(writer, err.Error(), http.StatusInternalServerError)
	}
	ctx = user.InjectOrgID(ctx, tenant)

	//TODO: Try to send proto otherwise error out
	if _, err = d.distributorClient.Push(ctx, &proto.WriteRequest); err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
	}
	fmt.Println("tenant: " + tenant)
}
