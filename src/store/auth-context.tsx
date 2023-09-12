import React from "react";
import { userInitState } from "src/hooks/Auth";
import type { AuthContextType } from "src/hooks/Auth";

const AuthContext = React.createContext<AuthContextType>({
  isSignedIn: false,
  user: userInitState,
  fb: null,
  isUserLoading: false,
});
export default AuthContext;
