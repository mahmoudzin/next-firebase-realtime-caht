"use client";
import React, { createContext, useContext, useState } from "react";
import { User } from "../types/user";

// Define the type for a user

// Define the context type
interface ActiveUserContextType {
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
}

// Create the context
const ActiveUserContext = createContext<ActiveUserContextType | undefined>(
  undefined
);

// Custom hook to use the ActiveUserContext
export const useActiveUser = () => {
  const context = useContext(ActiveUserContext);
  if (!context)
    throw new Error("useActiveUser must be used within an ActiveUserProvider");
  return context;
};

// Provider component
export const ActiveUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
};
