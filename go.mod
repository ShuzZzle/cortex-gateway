module github.com/ShuzZzle/cortex-gateway

go 1.14

require (
	github.com/cortexproject/cortex v1.8.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gin-gonic/gin v1.7.2
	github.com/go-kit/kit v0.10.0
	github.com/go-playground/validator/v10 v10.6.1 // indirect
	github.com/gogo/googleapis v1.4.0 // indirect
	github.com/gogo/status v1.1.0 // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/gorilla/mux v1.8.0
	github.com/json-iterator/go v1.1.11 // indirect
	github.com/leodido/go-urn v1.2.1 // indirect
	github.com/opentracing-contrib/go-grpc v0.0.0-20210225150812-73cb765af46e
	github.com/opentracing-contrib/go-stdlib v1.0.0
	github.com/opentracing/opentracing-go v1.2.0
	github.com/prometheus/client_golang v1.9.0
	github.com/prometheus/node_exporter v1.0.1 // indirect
	github.com/prometheus/prometheus v1.8.2-0.20210215121130-6f488061dfb4
	github.com/ugorji/go v1.2.6 // indirect
	github.com/weaveworks/common v0.0.0-20210112142934-23c8d7fa6120
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a // indirect
	golang.org/x/sys v0.0.0-20210521203332-0cec03c779c1 // indirect
	golang.org/x/text v0.3.6 // indirect
	google.golang.org/grpc v1.34.0
)

replace k8s.io/client-go => k8s.io/client-go v0.0.0-20190620085101-78d2af792bab
