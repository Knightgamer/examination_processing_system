import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("userRole") || null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  // Function to update the role both in state and local storage
  const updateRole = useCallback((newRole) => {
    localStorage.setItem("userRole", newRole);
    setRole(newRole);
  }, []);

  // Function to update the access token
  const updateAccessToken = useCallback((newToken) => {
    localStorage.setItem("accessToken", newToken);
    setAccessToken(newToken);
  }, []);

  // Function to clear role and token (e.g., on logout)
  const logout = useCallback(() => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessToken");
    setRole(null);
    setAccessToken(null);
  }, []);

  // Effect to synchronize state with local storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("userRole"));
      setAccessToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserRoleContext.Provider
      value={{ role, updateRole, accessToken, updateAccessToken, logout }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

export default UserRoleContext;
