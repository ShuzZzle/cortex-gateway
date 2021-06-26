################################################################################
##                               BUILD ARGS                                   ##
################################################################################
ARG GOLANG_IMAGE=golang:1.14.15
ARG ALPINE_ARCH=amd64

ARG DISTROLESS=gcr.io/distroless/base

################################################################################
##                              BUILD STAGE                                   ##
################################################################################
# Build the manager as a statically compiled binary so it has no dependencies
# libc, muscl, etc.
FROM ${GOLANG_IMAGE} as builder

WORKDIR /build
COPY go.mod go.sum ./
COPY pkg/ pkg/
COPY cmd/ cmd/
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64
ENV GOPROXY ${GOPROXY:-https://proxy.golang.org}

RUN go mod download
ARG VERSION=unknown
ARG GOPROXY

#   -w	disable DWARF generation
#   -s	disable symbol table
RUN go build -a -ldflags="-w -s -extldflags '-static' -X 'main.version=${VERSION}'" -o cortex-gateway ./cmd/cortex-gateway/main.go
################################################################################
##                               MAIN STAGE                                   ##
################################################################################
FROM ${DISTROLESS}

COPY --from=builder /build/cortex-gateway /bin/cortex-gateway

ENTRYPOINT ["/bin/cortex-gateway"]
CMD ["--help"]
