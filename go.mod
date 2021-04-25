module github.com/ShuzZzle/cortex-gateway

go 1.14

require (
	github.com/cortexproject/cortex v1.8.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/go-kit/kit v0.10.0
	github.com/gogo/googleapis v1.4.0 // indirect
	github.com/gogo/status v1.1.0 // indirect
	github.com/gorilla/mux v1.7.4 // indirect
	github.com/opentracing-contrib/go-stdlib v1.0.0
	github.com/opentracing/opentracing-go v1.2.0
	github.com/prometheus/client_golang v1.9.0
	github.com/prometheus/node_exporter v1.0.1 // indirect
	github.com/weaveworks/common v0.0.0-20210112142934-23c8d7fa6120
	google.golang.org/grpc v1.34.0
)

replace k8s.io/client-go => k8s.io/client-go v0.0.0-20190620085101-78d2af792bab
