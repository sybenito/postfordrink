import React from "react";
import type { AuthContextType } from "src/hooks/Auth";

const AuthContext = React.createContext<AuthContextType>({
  isSignedIn: false,
  user: null,
  fb: null,
  isUserLoading: false,
});
export default AuthContext;
