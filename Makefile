SOURCES := $(shell find . -name '*.go')
GOOS ?= $(shell go env GOOS)
TEST_PATTERN?=.
TEST_OPTIONS?=-v
VERSION ?= $(shell git describe --exact-match 2> /dev/null || \
                 git describe --match=$(git rev-parse --short=8 HEAD) --always --dirty --abbrev=8)
LDFLAGS   := "-w -s -X 'main.version=${VERSION}'"

export PATH := ./bin:$(PATH)
export GO111MODULE=on


cloud-provider-vcloud: $(SOURCES)
	 CGO_ENABLED=0 GOOS=$(GOOS) go build \
		-ldflags $(LDFLAGS) \
		-o bin/cortex-gateway \
		cmd/cortex-gateway/main.go

setup:
	curl -sfL https://install.goreleaser.com/github.com/golangci/golangci-lint.sh | sh
	go mod download
.PHONY: setup

lint:
	./bin/golangci-lint run --enable-all ./...
.PHONY: lint

# Run all the tests
test:
	go test $(TEST_OPTIONS) -failfast -race -coverpkg=./... -covermode=atomic -coverprofile=coverage.txt $(SOURCES) -run $(TEST_PATTERN) -timeout=2m
.PHONY: test

# Run all the tests and opens the coverage report
cover: test
	go tool cover -html=coverage.txt
.PHONY: cover

clean:
	rm -f cortex-gateway
.PHONY: clean
