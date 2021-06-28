import { WebStorageStateStore } from "oidc-client";
import { Authenticate } from "react-oidc-client";
import { ResponsiveSizeProvider } from "./context";
import React, { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom';

import App from './app/app';

const props = {

} as never;


ReactDOM.render(
  <StrictMode>
    <ResponsiveSizeProvider>
      <Suspense fallback={null}>
        <Authenticate basename="/ui" userManagerSettings={{
          loadUserInfo: true,
          client_id: "cortex-gateway",
          userStore: new WebStorageStateStore({ store: localStorage }),
          redirect_uri: "/ui/login-complete",
          popup_redirect_uri: "/ui/login-complete",
          post_logout_redirect_uri: "/api/logout",
          response_type: "id_token token",
        }}>
          <App />
        </Authenticate>
      </Suspense>
    </ResponsiveSizeProvider>
  </StrictMode>,
  document.getElementById('root')
);
