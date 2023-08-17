import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";

const useAuthProtect = () => {
  const { isSignedIn } = useContext(AuthContext);

  const validateAuth = () => {
    if (isSignedIn === false) {
      Navigate({ to: "/" });
    }
  };

  return { validateAuth };
};

export default useAuthProtect;
