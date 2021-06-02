import { useStore } from "@propero/easy-store-react";
import { Page } from "apps/cortex-ui/src/app/page/page";
import { TokenCard, TokenCardProps } from "apps/cortex-ui/src/app/token-card/token-card";
import { breadcrumbs } from "apps/cortex-ui/src/store/breadcrumbs";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { DateTime } from "luxon";

const tokens = Array(9).fill(0).map((_, n): TokenCardProps & { key: number } => ({
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  tenant: "Kunde 1",
  audience: "localhost",
  issuer: "Max Mustermann",
  expires: DateTime.now().plus({ days: Math.random() * 3 }).toJSDate(),
  scope: "read",
  key: n
}));

export function App() {
  const [crumbs] = useStore(breadcrumbs);

  return (
    <BrowserRouter>
      <Page drawer={null} toolbar={null} crumbs={crumbs}>
        <div className="flex flex-row flex-wrap">
          {tokens.map(token => <TokenCard {...token} />)}
        </div>
      </Page>
    </BrowserRouter>
  );
}

breadcrumbs.setValue([{
  key: "home",
  children: "Home",
  to: "/"
}, {
  key: "site",
  children: "SomeSite",
  to: "/some-site"
}]);

export default App;
