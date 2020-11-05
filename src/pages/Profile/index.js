import React, { useContext } from "react";

import {
  Container,
  Logout,
  LogoutText,
  NewLink,
  NewText,
  Nome,
} from "./styles";

import { AuthContext } from "../../contexts/auth";

import { useNavigation } from "@react-navigation/native";

import Header from "../../components/Header";

export default function Profile() {
  const navigation = useNavigation();
  const { signOut, user } = useContext(AuthContext);

  return (
    <Container>
      <Header />
      <Nome>{user.nome}</Nome>
      <NewLink onPress={() => navigation.navigate("Registrar")}>
        <NewText>Registrar Gastos</NewText>
      </NewLink>
      <Logout onPress={() => signOut()}>
        <LogoutText>Sair</LogoutText>
      </Logout>
    </Container>
  );
}
