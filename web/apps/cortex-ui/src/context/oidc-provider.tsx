import { User, UserManager, UserManagerSettings } from "oidc-client";
import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";



export interface AuthState {
  manager: UserManager;
  user?: User;
  setUser: (user?: User) => void;
}



const AuthContext = createContext<AuthState>({} as never);


export function OIDCProvider({ children, ...settings }: PropsWithChildren<UserManagerSettings>) {
  const { origin } = window.location;

  const withDefaults: UserManagerSettings = {
    redirect_uri: `${origin}/ui/login-complete`,
    response_type: "code",
    ...settings
  };

  const manager = useMemo(() => new UserManager(withDefaults), [settings]);
  const [user, setUser] = useState<User | undefined>();

  return <AuthContext.Provider value={{ manager, user, setUser }}>
    {children}
  </AuthContext.Provider>;
}

export function useUserManager() {
  return useContext(AuthContext);
}

export function useAuthentication() {
  const { manager, user, setUser } = useContext(AuthContext);
  const history = useHistory();
  const { pathname, href } = window.location;

  if (pathname.includes("/ui/login-complete")) {
    throw manager.signinRedirectCallback(href).then(() => manager.getUser().then(user => setUser(user ?? undefined))).then(() => {
      history.push("/");
    }).catch(() => {
      history.push("/");
    });
  } else if (!user) {
    throw manager.getUser().then((user): Promise<void> | void => {
      setUser(user ?? undefined);
      console.log(user);
      if (!user) return manager.signinRedirect();
    });
  }

  return { user, manager };
}
