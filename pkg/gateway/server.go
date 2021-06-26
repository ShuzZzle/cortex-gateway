package gateway

import (
	cortex_gateway "github.com/ShuzZzle/cortex-gateway"
	"io/fs"
	"net/http"
	"os"
	"path"
)

// SpaHandler spaHandler implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type SpaHandler struct {
	StaticPath string
	IndexPath  string
}
type fsFunc func(name string) (fs.File, error)
func (f fsFunc) Open(name string) (fs.File, error) {
	return f(name)
}

func AssetHandler(prefix string) http.Handler {
	handler := fsFunc(func(name string) (fs.File, error) {
		assetPath := path.Join(name)
		webAppFs, err := fs.Sub(cortex_gateway.WebApp, "web/dist/apps/cortex-ui")
		if err != nil {
			panic(err)
		}

		// If we can't find the asset, return the default index.html
		// content
		f, err := webAppFs.Open(assetPath)
		if os.IsNotExist(err) {
			return webAppFs.Open("index.html")
		}

		// Otherwise assume this is a legitimate request routed
		// correctly
		return f, err
	})

	return http.StripPrefix(prefix, http.FileServer(http.FS(handler)))
}