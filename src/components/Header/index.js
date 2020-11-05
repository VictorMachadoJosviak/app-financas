import React from "react";
import { Container, ButtonMenu } from "./styles";

import Icon from "react-native-vector-icons/Feather";

import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();
  return (
    <Container>
      <ButtonMenu onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" color="#fff" size={30} />
      </ButtonMenu>
    </Container>
  );
}
