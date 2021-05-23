package experimental

import (
	"google.golang.org/grpc/resolver"
)

const (
	CortexScheme = "dns"
	CortexServiceName = "cortex-distributor-headless.cortex.svc.cluster.local"
	CortexBackendAddr = "kube-dns.kube-system.svc.cluster.local:53"
)

type cortexResolverBuilder struct {

}

func (c cortexResolverBuilder) Build(target resolver.Target, cc resolver.ClientConn, opts resolver.BuildOptions) (resolver.Resolver, error) {
	r := &cortexResolver{
		target: target,
		cc:     cc,
		addrsStore: map[string][]string{
			CortexServiceName: {CortexBackendAddr},
		},
	}
	r.start()
	return r, nil
}

func (c cortexResolverBuilder) Scheme() string {
	return CortexScheme
}

func (r cortexResolver) start()  {
	addrsStore := r.addrsStore[r.target.Endpoint]
	addrs := make([]resolver.Address, len(addrsStore))
	for i, s := range addrs {
		addrs[i] = resolver.Address{Addr: s.Addr}
	}
	r.cc.UpdateState(resolver.State{Addresses: addrs})

}

type cortexResolver struct {
	target	resolver.Target
	cc resolver.ClientConn
	addrsStore map[string][]string
}

func (r cortexResolver) ResolveNow(options resolver.ResolveNowOptions) {}

func (r cortexResolver) Close() {
	// nothing to do here since we use kube-dns
}

func init() {
	resolver.Register(&cortexResolverBuilder{})
}