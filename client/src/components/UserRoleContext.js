// UserRoleContext.js
import React, { createContext, useContext, useState } from "react";

const UserRoleContext = createContext();

export const useUserRole = () => {
  return useContext(UserRoleContext);
};

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const updateUserRole = (role) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
  };

  return (
    <UserRoleContext.Provider value={{ userRole, updateUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
