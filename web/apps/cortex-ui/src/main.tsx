import { WebStorageStateStore } from "oidc-client";
import { Authenticate } from "react-oidc-client";
import { BrowserRouter } from "react-router-dom";
import { ResponsiveSizeProvider } from "./context";
import React, { StrictMode, Suspense } from "react";
import * as ReactDOM from "react-dom";

import App from "./app/app";

ReactDOM.render(
  <StrictMode>
    <ResponsiveSizeProvider>
      <Suspense fallback={null}>
        <BrowserRouter basename="/ui">
          <Authenticate basename="/ui" userManagerSettings={{
            loadUserInfo: true,
            userStore: new WebStorageStateStore({ store: localStorage }),
            authority: "/api/auth",
            client_id: "cortex-gateway",
            redirect_uri: "/ui/login-complete",
            popup_redirect_uri: "/ui/login-complete",
            post_logout_redirect_uri: "/api/logout",
            response_type: "id_token token"
          }}>
            <App/>
          </Authenticate>
        </BrowserRouter>
      </Suspense>
    </ResponsiveSizeProvider>
  </StrictMode>,
  document.getElementById("root")
);
