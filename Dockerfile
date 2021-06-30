################################################################################
##                               BUILD ARGS                                   ##
################################################################################
ARG GOLANG_IMAGE=golang:1.16.5
ARG NODE_IMAGE=node:lts
ARG ALPINE_ARCH=amd64

ARG DISTROLESS=gcr.io/distroless/base

################################################################################
##                              WEBSITE BUILD STAGE                           ##
################################################################################
FROM ${NODE_IMAGE} as website

WORKDIR /web
COPY web/ /web/
RUN npm install
RUN NODE_ENV=production npm run build

################################################################################
##                              BACKEND BUILD STAGE                           ##
################################################################################
# Build the manager as a statically compiled binary so it has no dependencies
# libc, muscl, etc.
FROM ${GOLANG_IMAGE} as builder

WORKDIR /build
COPY go.mod go.sum ./
COPY pkg/ pkg/
COPY cmd/ cmd/
COPY docs/ docs/
COPY webapp.go ./
COPY --from=website /web/dist/apps/cortex-ui web/dist/apps/cortex-ui
#ENV GOPROXY ${GOPROXY:-https://proxy.golang.org}
# Enables static compiling without libc dynamic linkage but is slower
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

RUN go mod download -x
ARG VERSION=unknown
#ARG GOPROXY

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
