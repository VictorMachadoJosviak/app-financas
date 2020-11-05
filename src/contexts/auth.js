import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";

import firebase from "../services/FirebaseConnection";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem("auth_user");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function storageUser(data) {
    await AsyncStorage.setItem("auth_user", JSON.stringify(data));
  }

  async function signUp(nome, email, password) {
    setLoadingAuth(true);
    const auth = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if (auth) {
      const uid = auth.user.uid;
      await firebase.database().ref("users").child(uid).set({
        nome,
        saldo: 0,
      });
      const data = {
        uid,
        nome,
        email: auth.user.email,
      };
      setUser(data);
      await storageUser(data);
    }
    setLoadingAuth(false);
  }

  async function signIn(email, password) {
    setLoadingAuth(true);
    try {
      const login = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (login) {
        const uid = login.user.uid;
        const currentUser = await firebase.database().ref("users").child(uid).once("value");
        const data = {
          uid,
          nome: currentUser.val().nome,
          email: login.user.email,
        };
        setUser(data);
        await storageUser(data);
      }
    } catch (error) {
      alert(error.code);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await firebase.auth().signOut();
    setUser(null);
    await AsyncStorage.clear();
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, signOut, loading, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
