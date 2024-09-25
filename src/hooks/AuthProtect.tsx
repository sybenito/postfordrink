import { useContext } from "react";
import AuthContext from "src/store/auth-context";

const useAuthProtect = () => {
  const { isSignedIn } = useContext(AuthContext);

  const validateAuth = () => {
    if (isSignedIn === true) {
      return true;
    }
    return false;
  };

  return { validateAuth };
};

export default useAuthProtect;
