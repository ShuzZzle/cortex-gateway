package experimental

import (
	"google.golang.org/grpc/balancer"
	"google.golang.org/grpc/balancer/base"
	"google.golang.org/grpc/grpclog"
	"sync"
)

const name = "consistent_hashing_with_bounded_loads"
var logger = grpclog.Component(name)

type chubBuilder struct {}
type chub struct {
	subConns []balancer.SubConn
	mu   sync.Mutex
}

func (c *chub) Pick(info balancer.PickInfo) (balancer.PickResult, error) {
	c.mu.Lock()
	sc := c.subConns[0]
	c.mu.Unlock()
	return balancer.PickResult{SubConn: sc}, nil
}

func (c chubBuilder) Build(info base.PickerBuildInfo) balancer.Picker {
	logger.Infof("%s: newPicker called with info: %v", name, info)
	if len(info.ReadySCs) == 0 {
		return base.NewErrPicker(balancer.ErrNoSubConnAvailable)
	}

	var scs []balancer.SubConn
	for sc := range info.ReadySCs {
		scs = append(scs, sc)
	}
	
	return &chub{
		subConns: scs,
	}
}


func newBuilder() balancer.Builder {
	return base.NewBalancerBuilder(name, &chubBuilder{}, base.Config{HealthCheck: true})
}

func init() {
	balancer.Register(newBuilder())
}