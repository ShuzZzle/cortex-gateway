import { OIDCProvider } from "apps/cortex-ui/src/context/oidc-provider";
import { BrowserRouter } from "react-router-dom";
import { ResponsiveSizeProvider } from "./context";
import React, { StrictMode, Suspense } from "react";
import * as ReactDOM from "react-dom";

import App from "./app/app";



ReactDOM.render(
  <StrictMode>
    <ResponsiveSizeProvider>
      <Suspense fallback={null}>
        <OIDCProvider client_secret={process.env.CLIENT_SECRET} authority={process.env.OIDC_AUTHORITY} client_id={process.env.CLIENT_ID}>
          <BrowserRouter basename="/ui">
            <App/>
          </BrowserRouter>
        </OIDCProvider>
      </Suspense>
    </ResponsiveSizeProvider>
  </StrictMode>,
  document.getElementById("root")
);
