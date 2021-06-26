package gateway

import (
	"flag"
	"fmt"
	"strings"
)

// Config for a gateway
type Config struct {
	DistributorAddress   string
	QueryFrontendAddress string
	JWTSecret			 string
	VersionFlag bool
	BallastBytes int
	DatabaseURI string
}

// RegisterFlags adds the flags required to config this package's Config struct
func (cfg *Config) RegisterFlags(f *flag.FlagSet) {
	f.IntVar(&cfg.BallastBytes, "mem-ballast-size-bytes", 0, "Size of memory ballast to allocate.")
	f.StringVar(&cfg.DistributorAddress, "gateway.distributor.address", "", "Upstream HTTP URL for Cortex Distributor")
	f.StringVar(&cfg.QueryFrontendAddress, "gateway.query-frontend.address", "", "Upstream HTTP URL for Cortex Query Frontend")
	f.StringVar(&cfg.JWTSecret, "gateway.auth.jwt-secret", "", "Secret to sign JSON Web Tokens")
	f.StringVar(&cfg.DatabaseURI, "database.uri", "mongodb://<user>:<password>@<host>:27017", "Full URI (including user + pw)")
	f.BoolVar(&cfg.VersionFlag, "version", false, "Print version and exit")
}

// Validate given config parameters. Returns nil if everything is fine
func (cfg *Config) Validate() error {
	if cfg.DistributorAddress == "" {
		return fmt.Errorf("you must set -gateway.distributor.address")
	}

	if !strings.HasPrefix(cfg.DistributorAddress, "http") {
		return fmt.Errorf("distributor address must start with a valid scheme (http/https). Given is '%v'", cfg.DistributorAddress)
	}

	if cfg.QueryFrontendAddress == "" {
		return fmt.Errorf("you must set -gateway.query-frontend.address")
	}

	if !strings.HasPrefix(cfg.QueryFrontendAddress, "http") {
		return fmt.Errorf("query frontend address must start with a valid scheme (http/https). Given is '%v'", cfg.DistributorAddress)
	}

	return nil
}
