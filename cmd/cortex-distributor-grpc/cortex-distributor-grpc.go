package main

import (
	"context"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/experimental"
	"github.com/cortexproject/cortex/pkg/cortexpb"
	"github.com/cortexproject/cortex/pkg/distributor/distributorpb"
	"github.com/cortexproject/cortex/pkg/util/grpcclient"
	"github.com/prometheus/prometheus/pkg/labels"
	"github.com/weaveworks/common/user"
	"google.golang.org/grpc"
	"log"
	"time"
)

var s2 = []cortexpb.Sample{
	{Value: 1, TimestampMs: experimental.MakeCorrectTimeStamp()},
}


func main() {
	cfg := grpcclient.Config{
		MaxRecvMsgSize:      16 * 1024 * 1024,
		MaxSendMsgSize:      4 * 1024 * 1024,
		GRPCCompression:     "",
		RateLimit:           0,
		RateLimitBurst:      0,
		BackoffOnRatelimits: false,
		TLSEnabled:          false,
	}
	opts, err := cfg.DialOption(experimental.SetupInterceptors())
	opts = append(opts, grpc.WithBlock())
	opts = append(opts, grpc.WithInsecure())
	conn, err := grpc.Dial("localhost:9095", opts...)
	if err != nil {
		log.Fatal(err)
	}
	c := distributorpb.NewDistributorClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	ctx = user.InjectOrgID(ctx, "testuser")
	defer cancel()
	r, err := c.Push(ctx, &cortexpb.WriteRequest{
		Timeseries: []cortexpb.PreallocTimeseries{
			{TimeSeries: &cortexpb.TimeSeries{Labels: []cortexpb.LabelAdapter{{Name: labels.MetricName, Value: "cortex_distributor_grcp_test_1"}, {Name: "l", Value: "1"}}, Samples: s2}},
			{TimeSeries: &cortexpb.TimeSeries{Labels: []cortexpb.LabelAdapter{{Name: labels.MetricName, Value: "cortex_distributor_grcp_test_2"}, {Name: "l", Value: "2"}}, Samples: s2}}},
		Source:                  cortexpb.API,
		SkipLabelNameValidation: true,
	})
	if err != nil {
		log.Fatalf("Err: %s", err)
	}
	log.Printf("%s", r.String())
}
