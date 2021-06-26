import { useStore } from "@propero/easy-store-react";
import { SidebarBase } from "apps/cortex-ui/src/app/sidebar/sidebar-base";
import { Avatar } from "./avatar/avatar";
import { MessageBox } from "./dialog/message-box";
import { Spacer } from "./spacer/spacer";
import { Menu, MenuEntryProps } from "./menu/menu";
import { Page } from "./page/page";
import { TokenCard, TokenCardProps } from "./token-card/token-card";
import { breadcrumbs } from "../store/breadcrumbs";
import React, { useCallback, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { DateTime } from "luxon";
import faker from "faker";



const tokens = Array(9).fill(0).map((_, n): TokenCardProps & { key: number } => ({
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  tenant: faker.company.companyName(),
  audience: "localhost",
  issuer: `${faker.name.firstName()} ${faker.name.lastName()}`,
  expires: DateTime.now().plus({ days: Math.random() * 10 }).toJSDate(),
  scope: faker.random.arrayElement(["read", "write"]),
  key: n
}));



const sidebar: MenuEntryProps[] = [
  {
    label: "Dashboard",
    icon: "home",
    to: "/",
    match: "/",
    exact: true
  },
  {
    label: "Tokens",
    icon: "user-id",
    to: "/tokens",
    match: "/tokens",
  },
  {
    label: "Teams",
    icon: "user-group",
    to: "/teams",
    match: "/teams",
  },
  {
    label: "Tenants",
    icon: "briefcase",
    to: "/tenants",
    match: "/tenants"
  }
];

export function App() {
  const [crumbs] = useStore(breadcrumbs);
  const user = {
    name: "Max Mustermann",
    email: "max.mustermann@example.com",
    id: 127198632,
    team: { id: 211232131312, name: "Employee" },
    avatar: "https://picsum.photos/256/256"
  };

  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen(it => !it)
  }, [open, setOpen]);

  const toolbar = <div>
    <Spacer/>
    <Avatar src={user.avatar} name={user.name} description={user.team.name}/>
  </div>;


  return (
    <BrowserRouter basename="/ui">
      <SidebarBase top static content={toolbar}>
        <Menu items={sidebar} open={open}>
          <Page toolbar={toolbar} crumbs={crumbs}>
            <div className="flex flex-row flex-wrap">
              {tokens.map(token => <TokenCard {...token} />)}
            </div>
            <MessageBox
              open={false}
              title="Are you sure?"
              text="This Action will delete all the databases in existence."
              options={[{ text: "Cancel" }, { text: "Confirm" }]}
              closeOption={{ text: "Confirm" }}
              onAction={(action) => console.log("a", action)}
            />
          </Page>
        </Menu>
      </SidebarBase>
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
