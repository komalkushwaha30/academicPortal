// src/contexts/AuthContext.jsx
import React, { useContext, useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser(currentUser);
            setRole(docSnap.data().role);
          } else {
            setUser(currentUser);
            setRole(null); // No role found
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(currentUser);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false); // Always set loading to false after check
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
