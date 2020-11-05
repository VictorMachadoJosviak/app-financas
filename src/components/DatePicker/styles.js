import { Platform } from "react-native";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  background-color: ${Platform.OS === "ios" ? "#00000006" : "transparent"};
  position: absolute;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;
export const Header = styled.View`
  width: 100%;
  padding: 16px;
  align-items: flex-end;
  justify-content: flex-end;
  background-color: "white";
  border-bottom-width: 1px;
  border-bottom-color: "gray";
`;
